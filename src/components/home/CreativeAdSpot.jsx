import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// Virtual companies data with random images
const virtualCompanies = [
  {
    id: 1,
    name: "شركة الأمل للعقارات",
    jobDescription: "بيع وشراء الشقق والفيلات الفاخرة في أهم أحياء دمشق",
    location: "دمشق",
    category: "عقارات",
    phone: "+963 11 555 444",
    address: "شارع أبو رمانة، برج الأمل، الطابق السادس",
    images: [
      "https://picsum.photos/seed/realestate1/600/400",
      "https://picsum.photos/seed/realestate2/600/400",
      "https://picsum.photos/seed/realestate3/600/400",
    ],
  },
  {
    id: 2,
    name: "معرض النور للسيارات",
    jobDescription: "معرض سيارات معتمد لبيع المركبات الجديدة والمستعملة بضمان شامل",
    location: "حلب",
    category: "سيارات",
    phone: "+963 21 888 777",
    address: "طريق المطار السريع، مقابل صالة المعارض",
    images: [
      "https://picsum.photos/seed/car1/600/400",
      "https://picsum.photos/seed/car2/600/400",
      "https://picsum.photos/seed/car3/600/400",
    ],
  },
  {
    id: 3,
    name: "مؤسسة الفجر للأراضي",
    jobDescription: "استشارات واستثمارات أراضٍ مخدّمة للمشاريع السكنية والتجارية",
    location: "حمص",
    category: "أراضي",
    phone: "+963 31 444 321",
    address: "حي الغوطة، مبنى رقم 18، مكتب 4",
    images: [
      "https://picsum.photos/seed/land1/600/400",
      "https://picsum.photos/seed/land2/600/400",
      "https://picsum.photos/seed/land3/600/400",
    ],
  },
  {
    id: 4,
    name: "مركز البحر المتوسط للقوارب",
    jobDescription: "بيع وتأجير القوارب واليخوت مع خدمات الصيانة والتجهيزات البحرية",
    location: "اللاذقية",
    category: "مركبات بحرية",
    phone: "+963 41 222 199",
    address: "مارينا اللاذقية، رصيف 3، مكتب 12",
    images: [
      "https://picsum.photos/seed/boat1/600/400",
      "https://picsum.photos/seed/boat2/600/400",
      "https://picsum.photos/seed/boat3/600/400",
    ],
  },
  {
    id: 5,
    name: "معرض الصقر للدراجات",
    jobDescription: "تجارة الدراجات النارية والسكوترات مع مركز صيانة وقطع غيار أصلية",
    location: "دمشق",
    category: "دراجات",
    phone: "+963 11 776 665",
    address: "مزة أوتوستراد، مقابل مجمع الفردوس",
    images: [
      "https://picsum.photos/seed/bike1/600/400",
      "https://picsum.photos/seed/bike2/600/400",
      "https://picsum.photos/seed/bike3/600/400",
    ],
  },
];

// Simple, self-contained creative ad banner with floating shapes and glass card
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.03); }
  100% { opacity: 0.6; transform: scale(1); }
`;

const Wrapper = styled.section`
  position: relative;
  isolation: isolate;
  padding: 2.5rem 1rem;
  direction: rtl;
  background:
    radial-gradient(1200px 400px at 100% -20%, rgba(253, 210, 80, 0.20), transparent 60%),
    radial-gradient(900px 300px at -10% 120%, rgba(84, 190, 255, 0.18), transparent 60%),
    linear-gradient(180deg, #fff, #fff);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 1.25rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: saturate(160%) blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Visual = styled.div`
  position: relative;
  min-height: 280px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #111827, #312e81);

  .swiper {
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }

  .swiper-slide {
    position: relative;
    overflow: hidden;
  }

  .swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .swiper-pagination {
    bottom: 12px !important;
  }

  .swiper-pagination-bullet {
    background: rgba(255, 255, 255, 0.8);
    opacity: 0.6;
    width: 8px;
    height: 8px;
  }

  .swiper-pagination-bullet-active {
    opacity: 1;
    background: #fff;
    width: 24px;
    border-radius: 4px;
  }
`;

const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
`;

const CompanyName = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
`;

const CompanyDescription = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CompanyMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #64748b;
  font-size: 0.85rem;
  
  &::before {
    content: "${({ $icon }) => $icon || ""}";
    font-size: 0.9rem;
  }
`;

const InfoList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.35rem 0 0;
  padding: 0;
  list-style: none;
`;

const InfoItem = styled.li`
  display: grid;
  grid-template-columns: minmax(110px, 140px) 1fr;
  gap: 0.75rem;
  align-items: center;
  font-size: 0.88rem;
  color: #1f2937;
  width: 100%;
`;

const InfoLabel = styled.span`
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.3px;
`;

const InfoValue = styled.span`
  font-weight: 600;
  color: #0f172a;
  text-align: right;
  line-height: 1.5;
  word-break: break-word;
`;

const CategoryBadge = styled.span`
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border-radius: 6px;
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 600;
  align-self: flex-start;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Badge = styled.span`
  align-self: flex-start;
  background: #111827;
  color: #fff;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  letter-spacing: 0.3px;
  animation: ${pulse} 4s ease-in-out infinite;
`;

const Title = styled.h3`
  margin: 0;
  font-size: clamp(1.3rem, 1.6vw + 1rem, 2rem);
  color: #0f172a;
  line-height: 1.4;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #475569;
  font-size: 1rem;
`;

const Cta = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
  background: #f59e0b;
  color: #1f2937;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 0.6rem 1rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 6px 18px rgba(245, 158, 11, 0.25);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 26px rgba(245, 158, 11, 0.35);
  }
`;

const CreativeAdSpot = ({
  title = "إعلانات مميزة",
  subtitle = "اكتشف أفضل العروض من الشركات الموثوقة",
  ctaText = "عرض جميع الإعلانات",
  ctaHref = "/ads",
  badgeText = "إعلان مميز",
}) => {
  const [currentCompany, setCurrentCompany] = useState(virtualCompanies[0]);

  // Get random company on mount and every 8 seconds
  useEffect(() => {
    const getRandomCompany = () => {
      const randomIndex = Math.floor(Math.random() * virtualCompanies.length);
      setCurrentCompany(virtualCompanies[randomIndex]);
    };

    // Set initial random company
    getRandomCompany();

    // Change company every 8 seconds
    const interval = setInterval(getRandomCompany, 8000);

    return () => clearInterval(interval);
  }, []);


  return (
    <Wrapper aria-label="مساحة إعلان إبداعية">
      <Container>
        <Card>
          <Content>
            <Badge>{badgeText}</Badge>
            <Title>{title}</Title>
            <Subtitle>{subtitle}</Subtitle>
            
            <CompanyInfo>
              <CategoryBadge>{currentCompany.category}</CategoryBadge>
              <CompanyName>{currentCompany.name}</CompanyName>
              <CompanyDescription>{currentCompany.jobDescription}</CompanyDescription>
              <CompanyMeta>
                <MetaItem $icon="📍">{currentCompany.location}</MetaItem>
              </CompanyMeta>
              <InfoList>
                <InfoItem>
                  <InfoLabel>رقم الهاتف</InfoLabel>
                  <InfoValue>{currentCompany.phone}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>العنوان</InfoLabel>
                  <InfoValue>{currentCompany.address}</InfoValue>
                </InfoItem>
              </InfoList>
            </CompanyInfo>

            <Cta href={ctaHref} aria-label={ctaText}>
              {ctaText}
              <span style={{
                display: "inline-block",
                transform: "rotate(-45deg)",
              }}>↗</span>
            </Cta>
          </Content>

          <Visual>
            <Swiper
              effect="fade"
              modules={[EffectFade, Autoplay, Pagination]}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              speed={800}
              className="company-images-swiper"
            >
              {currentCompany.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`${currentCompany.name} - صورة ${index + 1}`}
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Visual>
        </Card>
      </Container>
    </Wrapper>
  );
};

export default CreativeAdSpot;



