import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "@/components/footer/Footer";
import Header1 from "@/components/headers/Header1";
import DetailsTitle from "@/components/property-details/DetailsTitle";
import PropertyDetails from "@/components/property-details/PropertyDetails";
import Slider3 from "@/components/property-details/Slider3";
import MetaComponent from "@/components/common/MetaComponent";
import Loader from "@/components/Loader";
import api from "@/redux/api";
import DeleteAdModal from "../user-dashboard/DeleteAdModal";

export default function AdDetailsPage() {
  const { id, slug } = useParams();
  const [ad, setAd] = useState(null);
  const [similarAds, setSimilarAds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const { data } = await api.get(`/advertisement/${id}/${slug}`);
        setAd(data?.data);
        setSimilarAds(data?.data?.similar_advertisements?.advertisements);
      } catch (err) {
        if (err.response?.status === 404) {
          navigate("/404", {
            replace: true,
          });
          return;
        }
        setError(
          err.response?.data?.message || "Failed to fetch property details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id, slug]);
  useEffect(() => {
    if (ad) {
      console.log(ad);
    }
  }, [ad]);
  if (loading) return <Loader />;

  const metadata = {
    title: `Syria Souq ${ad && "| " + ad?.title}`,
    description: `${ad && ad?.description}`,
    image: ad?.images?.[0]?.url || "",
    url: window.location.href,
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header1 />
      <DetailsTitle
        ad={ad}
        openDeleteModal={() => {
          setOpenDeleteModal(true);
        }}
      />
      <Slider3 images={ad?.images} />
      <PropertyDetails ad={ad} similarAds={similarAds} />
      <DeleteAdModal
        open={openDeleteModal}
        close={() => {
          setOpenDeleteModal(false);
        }}
        adId={ad?.id}
        redirectAfterDelete="/dashboard/my-advertisements"
      />
      <Footer />
    </>
  );
}
