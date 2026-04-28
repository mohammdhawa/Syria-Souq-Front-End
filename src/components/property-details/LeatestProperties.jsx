import React from "react";
import SimilarAdCard from "../Advertisements/SimilarAdCard";

export default function LeatestProperties({ similarAds }) {
  return (
    <>
      {similarAds?.map((ad, i) => {
        <SimilarAdCard ad={ad} key={i} />;
      })}
    </>
  );
}
