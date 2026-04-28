import React, { useMemo } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

// Sticky right-side ad slot similar to Google right rail
// Hidden on small screens and sensitive routes (dashboard/auth)

const Container = styled.aside`
  position: fixed;
  top: 96px; /* below header */
  right: 16px;
  width: 300px;
  z-index: 4;
  display: block;

  @media (max-width: 1280px) {
    display: none;
  }
`;

const Frame = styled.a`
  display: inline-block;
  width: 300px;
  height: ${({ $height }) => $height}px;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  text-decoration: none;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Caption = styled.div`
  position: absolute;
  inset: auto 0 0 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%);
  color: #fff;
  padding: 10px 12px;
  font-size: 12px;
`;

const RightRailAd = ({
  img = "/images/ads/sample-300x600.jpg",
  href = "/publish-ad",
  height = 600,
  caption = "إعلان برعاية شريكنا",
  hideOn = ["/dashboard", "/auth"],
}) => {
  const { pathname } = useLocation();

  const shouldHide = useMemo(() => {
    return hideOn.some((p) => pathname.startsWith(p));
  }, [pathname, hideOn]);

  if (shouldHide) return null;

  return (
    <Container aria-label="إعلان جانبي">
      <Frame href={href} $height={height} rel="nofollow sponsored">
        <div style={{ position: "relative", width: "100%", height }}>
          <Image src={img} alt="Ad" />
          <Caption>{caption}</Caption>
        </div>
      </Frame>
    </Container>
  );
};

export default RightRailAd;



