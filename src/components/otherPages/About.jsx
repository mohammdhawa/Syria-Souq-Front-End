import React from "react";

import { Link } from "react-router-dom";
export default function About() {
  return (
    <section className="flat-section">
      <div className="container flat-header-wrapper-about">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h1 className="title">
              مرحبًا بك في سوق سوريا – بوابتك الموثوقة لعالم الإعلانات العقارية
              والمركبات!
            </h1>
            <p className="text-variant-1 desc">
              في سوق سوريا، نؤمن أن كل إعلان يحمل حلمًا، وكل منزل أو أرض أو
              مركبة تمثل بداية جديدة لشخص ما. أنشأنا منصتنا لنمنحك تجربة سهلة
              وفعالة في نشر واستكشاف الإعلانات التي تهمك، سواء كنت تبحث عن منزل
              يسكنه الأمل، أو سيارة تنقلك نحو المستقبل، أو دراجة لمغامرة جديدة،
              أو حتى مركب بحري للهروب من روتين الحياة.
            </p>
            <p className="text-variant-1 desc">
              هدفنا هو ربط البائعين بالمشترين بطريقة ذكية وآمنة، عبر واجهة حديثة
              وتجربة مستخدم بسيطة ومريحة. نحن هنا لنجعل رحلتك في البيع أو الشراء
              أكثر سلاسة واحترافية، بدعم من فريقنا المتخصص وبتقنياتنا المتطورة.
            </p>

            <Link
              to={`/contact`}
              className="mt-5 tf-btn btn-view primary hover-btn-view"
              style={{ color: "#1e1e1e" }}
            >
              تواصل معنا
              <span
                style={{ color: "#1e1e1e" }}
                className="icon icon-arrow-left2"
              ></span>
            </Link>
            <div className="box-img item1 ani5">
              <img
                alt=""
                width="155"
                height="155"
                src="/images/service/car3.jpeg"
              />
            </div>
            <div className="box-img item2 ani4">
              <img
                alt=""
                width="181"
                height="181"
                src="/images/service/bilding.jpeg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
