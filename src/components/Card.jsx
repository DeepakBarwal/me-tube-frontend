import styled from "styled-components";

const Container = styled.div`
  width: 360px;
  margin-bottom: 45px;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: 202px;
  background-color: #999;
`;

const Details = styled.div`
  display: flex;
  margin-top: 16px;
  gap: 12px;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const Card = () => {
  return (
    <Container>
      <Image src="https://img.freepik.com/free-photo/neon-tropical-monstera-leaf-banner_53876-138943.jpg?w=2000" />
      <Details>
        <ChannelImage src="https://slp-statics.astockcdn.net/static_assets/staging/22spring/free/browse-vector-categories-collections/Card4_399895799.jpg?width=580" />
        <Texts>
          <Title>Test Video</Title>
          <ChannelName>tuturu</ChannelName>
          <Info>345,123 views • 1 day ago</Info>
        </Texts>
      </Details>
    </Container>
  );
};

export default Card;
