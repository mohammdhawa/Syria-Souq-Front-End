import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function FaqsSectionHome() {
  const { popularQuestions } = useSelector((state) => state.homePage);

  const faqsArray = Object.values(popularQuestions || {}).sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return (
      (priorityOrder[a.priority?.toLowerCase()] || 4) -
      (priorityOrder[b.priority?.toLowerCase()] || 4)
    );
  });

  return (
    <section className="flat-section">
      <div className="container">
        <div className="tf-faq wow fadeInUp">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "auto",
            }}
          >
            <h3 className="text-center title">الاسئلة الشائعة</h3>
            <Link
              style={{ color: "#1E1E1E", height: "50px", marginBottom: "50px" }}
              className="tf-btn btn-view primary hover-btn-view"
              to="/faq"
            >
              عرض الكل
            </Link>
          </div>
          <ul className="box-faq" id="wrapper-faq">
            {faqsArray.map(({ category, question, answer }, index) => {
              const faqId = `accordion-faq-${index}`;
              return (
                <li key={faqId} className="faq-item">
                  <a
                    href={`#${faqId}`}
                    className="faq-header collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls={faqId}
                  >
                    {question}
                  </a>
                  <div
                    id={faqId}
                    className="collapse"
                    data-bs-parent="#wrapper-faq"
                  >
                    <p className="faq-body">{answer}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
