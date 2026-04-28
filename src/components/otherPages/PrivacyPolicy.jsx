import React from "react";
import { Link } from "react-router-dom";
export default function PrivacyPolicy() {
  return (
    <section className="flat-section flat-wrapper-privacy">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="sidebar-privacy">
              <div className="cate-privacy-box">
                <h5 className="mb-20">الفئات</h5>
                <ul className="list-cate-privacy">
                  <li>
                    <a href="#">
                      <span>مرحبًا بك</span>
                      <svg
                        style={{ transform: "rotate(180deg)" }}
                        className="icon"
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.9375 6.1875L16.75 9M16.75 9L13.9375 11.8125M16.75 9H3.25"
                          stroke="black"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#aboutUs">
                      <span>من نحن </span>
                      <svg
                        style={{ transform: "rotate(180deg)" }}
                        className="icon"
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.9375 6.1875L16.75 9M16.75 9L13.9375 11.8125M16.75 9H3.25"
                          stroke="black"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#aboutUs">
                      <span>احترامنا لخصوصيتك</span>
                      <svg
                        style={{ transform: "rotate(180deg)" }}
                        className="icon"
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.9375 6.1875L16.75 9M16.75 9L13.9375 11.8125M16.75 9H3.25"
                          stroke="black"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#aboutUs">
                      <span>المعلومات التي نقوم بجمعها وكيفية استخدامها</span>
                      <svg
                        style={{ transform: "rotate(180deg)" }}
                        className="icon"
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.9375 6.1875L16.75 9M16.75 9L13.9375 11.8125M16.75 9H3.25"
                          stroke="black"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-8 wrapper-privacy">
            <div className="box-item mb-30">
              <h4 className="mb-30">سياسة الخصوصية</h4>
              <h6 className="mb-20">مرحبًا بك</h6>
              <p className="mb-20">
                نحن نحترم خصوصيتك تمامًا كما تتوقع منا. توضح هذه السياسة كيف
                ولماذا نقوم بجمع واستخدام ومشاركة وإدارة معلوماتك الشخصية مثل
                البريد الإلكتروني والأسم والرقم وغيره من المعلومات .
              </p>
              <p className="mb-20">
                كما تشرح كيف نقوم بتخزين هذه المعلومات وحمايتها.
              </p>
              <p className="mb-20">
                وتُوضح لك أيضًا كيف يمكنك مراجعة والتحكم في المعلومات الشخصية
                التي نحتفظ بها أو نجمعها عنك.
              </p>
              <div className="mb-20">
                <p className="mb-10">عند قيامك بأي من الأمور التالية:</p>
                <ul className="list-default mb-10">
                  <li>استخدامك لموقعنا الإلكتروني أو تطبيقاتنا،</li>
                  <li>تسجيل حساب جديد،</li>
                  <li>نشر إعلان أو التواصل مع المعلنين،</li>
                  <li>الاشتراك في خدماتنا أو العروض التي نقدمها،</li>
                </ul>
                <p>فإننا نعتبر أنك قد قرأت ووافقت على هذه السياسة.</p>
              </div>
              <p className="mb-20">
                يرجى العلم أننا قد نقوم بتحديث هذه السياسة من وقت لآخر لمواكبة
                أي تغييرات تنظيمية أو تطويرات جديدة. ننصحك بمراجعتها بشكل دوري.
                وسنعتبر استمرارك في استخدام خدماتنا موافقة ضمنية منك على
                التعديلات الجديدة.
              </p>
            </div>
            <div className="box-item mb-30">
              <h6 id="aboutUs" className="mb-20">
                من نحن
              </h6>
              <p className="mb-20">
                في هذه السياسة، نعني بعبارات "نحن"، "لنا" أو "موقعنا" شركة [اسم
                شركتك أو مشروعك] وكافة الخدمات المرتبطة بها.
              </p>
              <div className="mb-20">
                <p className="mb-10">
                  نحن ندير منصات إلكترونية متعددة عبر الويب والجوال تشمل:{" "}
                </p>
                <ul className="list-default mb-10">
                  <li>نشر إعلانات السيارات الجديدة والمستعملة،</li>
                  <li>تسويق العقارات السكنية والتجارية،</li>
                  <li>عرض الأراضي الزراعية والاستثمارية،</li>
                  <li>بيع وشراء المراكب البحرية بمختلف أنواعها،</li>
                  <li>عرض وبيع الدراجات النارية والمعدات ذات الصلة.</li>
                </ul>
                <p>
                  نلتزم في جميع تعاملاتنا بأعلى معايير الخصوصية وحماية البيانات
                  الشخصية.
                </p>
              </div>
            </div>
            <div className="box-item mb-30">
              <h6 id="aboutUs" className="mb-20">
                احترامنا لخصوصيتك
              </h6>
              <p className="mb-20">ندرك تمامًا أهمية حماية معلوماتك الشخصية.</p>
              <p>
                عند جمعنا ومعالجتنا لمعلوماتك، فإننا نلتزم بالأنظمة واللوائح
                المحلية المتعلقة بحماية البيانات وخصوصية الأفراد.
              </p>
            </div>
            <div className="box-item">
              <h6 id="aboutUs" className="mb-20">
                المعلومات التي نقوم بجمعها وكيفية استخدامها
              </h6>
              <ul className="list-default mb-10">
                <li>
                  بيانات التعريف: مثل اسمك الكامل، عنوان بريدك الإلكتروني، رقم
                  هاتفك.
                </li>
                <li>
                  معلومات الإعلانات: تفاصيل الإعلانات التي تقوم بنشرها، مثل نوع
                  السيارة أو العقار أو الأرض أو المركب أو الدراجة المعروضة للبيع
                  أو الإيجار.
                </li>
                <li>
                  معلومات التفاعل: مثل الرسائل بينك وبين المستخدمين الآخرين، أو
                  بينك وبين فريق خدمة العملاء لدينا.
                </li>
                <li>
                  البيانات الفنية: مثل عنوان بروتوكول الإنترنت (IP)، نوع
                  المتصفح، نظام التشغيل، بيانات الموقع الجغرافي (إذا سمحت بذلك).
                </li>
              </ul>
              <div className="mb-20">
                <p className="mb-10">نستخدم معلوماتك لتحقيق عدة أهداف منها:</p>
                <ul className="list-default mb-10">
                  <li>تقديم خدماتنا لك بكفاءة وسهولة،</li>
                  <li>تحسين تجربتك في استخدام الموقع وتقديم محتوى مخصص لك،</li>
                  <li>
                    مساعدتك على إدارة إعلاناتك ومتابعة استجابات المستخدمين،
                  </li>
                  <li>
                    التواصل معك بشأن تحديثات الخدمة أو عروض ترويجية قد تهمك،
                  </li>
                  <li>
                    الحفاظ على سلامة وأمان الموقع ومنع الأنشطة الاحتيالية أو غير
                    القانونية.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
