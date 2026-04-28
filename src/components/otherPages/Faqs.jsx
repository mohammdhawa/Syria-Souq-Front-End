import React, { useEffect, useState } from "react";
import api from "@/redux/api";
import Loader from "../Loader";

export default function Faqs() {
  const [faqs, setFaqs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/faqs")
      .then((response) => {
        const allFaqs = response.data.data;
        const activeFaqs = allFaqs.filter((faq) => faq.status === 1);
        const grouped = activeFaqs.reduce((acc, faq) => {
          const category = faq.category || "عام";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(faq);
          return acc;
        }, {});

        setFaqs(grouped);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);
  const categoryLabels = {
    Payment: "المدفوعات",
    Subscribtion: "الاشتراكات",
    Advertisement: "الإعلانات",
    System: "النظام",
    General: "عام",
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <section className="flat-section">
      <div className="container">
        {Object.keys(faqs).map((category, i) => (
          <div key={i} className="tf-faq">
            <h3 className="fw-8 fs-2 mb-2 text-center title">
              {categoryLabels[category] || category}
            </h3>
            <ul className="box-faq" id={`wrapper-faq-${i}`}>
              {faqs[category].map((faq, j) => (
                <li key={faq.id} className="faq-item">
                  <a
                    href={`#faq-${faq.id}`}
                    className="faq-header collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls={`faq-${faq.id}`}
                  >
                    {faq.question}
                  </a>
                  <div
                    id={`faq-${faq.id}`}
                    className="collapse"
                    data-bs-parent={`#wrapper-faq-${i}`}
                  >
                    <p className="faq-body">{faq.answer}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
