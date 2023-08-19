import React from "react";
import { styled } from "styled-components";

const Container = styled.div`
  /* box-shadow: 0px 0px 4px 0.5px rgba(0, 0, 0, 0.1); */
`;

const CarouselIndicators = styled.div``;

const IndicatorButton = styled.button``;

const CarouselInner = styled.div``;

const ImageContainer = styled.div``;

const Image = styled.img``;

const TextWrapper = styled.div``;

const Title = styled.h5`
  font-size: 23px;
  font-weight: 500;
  letter-spacing: 3px;
  background-color: rgba(55, 53, 48, 0.8);
`;

const Text = styled.p``;

const PrevButton = styled.button`
  margin-left: 10px;
  width: 50px;
  height: 50px;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
`;

const NextButton = styled.button`
  margin-right: 10px;
  width: 50px;
  height: 50px;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
`;

const Span = styled.span``;

const Slider = ({ data }) => {
  return (
    <Container
      id="carouselExampleCaptions"
      className="carousel slide rounded-2"
      data-bs-ride="carousel"
    >
      <CarouselIndicators className="carousel-indicators">
        {data?.map((item, index) => (
          <IndicatorButton
            key={index}
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
          />
        ))}
      </CarouselIndicators>
      <CarouselInner className="carousel-inner rounded-2 align-items-center">
        {data?.map((item, index) => (
          <ImageContainer
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            data-bs-interval="3000"
          >
            <Image
              src={item.image ? item.image : item}
              className={"d-block w-100 h-100 text-center mx-auto"}
              alt="Chắc là một cái ảnh nào đó."
            />
            <TextWrapper className="carousel-caption d-none d-md-block">
              <Title className="text-center w-75 ms-auto me-auto rounded-3 p-1">
                {item?.title}
              </Title>
              <Text>{item?.desc}</Text>
            </TextWrapper>
          </ImageContainer>
        ))}
      </CarouselInner>
      <PrevButton
        className="carousel-control-prev bg-black rounded-circle"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <Span className="carousel-control-prev-icon" aria-hidden="true" />
        <Span className="visually-hidden">Previous</Span>
      </PrevButton>
      <NextButton
        className="carousel-control-next bg-black rounded-circle"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <Span className="carousel-control-next-icon" aria-hidden="true" />
        <Span className="visually-hidden">Next</Span>
      </NextButton>
    </Container>
  );
};

export default Slider;
