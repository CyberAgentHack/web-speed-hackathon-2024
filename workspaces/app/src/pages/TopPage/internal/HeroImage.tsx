import styled from 'styled-components';

const _Wrapper = styled.div`
  aspect-ratio: 16 / 9;
  width: 100%;
`;

const _Image = styled.img`
  display: inline-block;
  width: 100%;
  aspect-ratio: 16 / 9;
`;

export const HeroImage: React.FC = () => {
  return (
    <_Wrapper>
      <_Image src="/assets/hero_image_small.png" alt="Cyber TOON" />
    </_Wrapper>
  );
};
