import React, { Component } from 'react';
import styled from 'styled-components';
import Card from '../../Card';
import { getNews } from '../../../api';
import { shortenText } from '../../../util';
import Loading from '../../Loading';
import { Title } from '../../Text';
import DesktopTabletView from '../../DesktopTabletView';
import MobileView from '../../MobileView';

class MemberArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      newsHeightOffset: 0
    };
  }

  componentDidMount() {
    getNews()
      .then(news => this.setState({ news }))
      .catch(console.error);
  }

  generateNews = () => this.state.news.map((n) => (
    <NewsItem key={n.title} className="animated fadeIn" onClick={() => window.open(n.link)}>
      <DateContainer>
        <NewsDate>{new Date(n.date).toLocaleDateString()}</NewsDate>
      </DateContainer>
      <DesktopTabletView><NewsTitle>{n.title}</NewsTitle></DesktopTabletView>
      <MobileView><NewsTitle>{shortenText(n.title, 50)}</NewsTitle></MobileView>
    </NewsItem>
  ));

  handleNewsScroll = (evt) => {
    const { scrollTop } = evt.target;
    const { newsHeightOffset } = this.state;
    if (scrollTop < 150) {
      this.setState({ newsHeightOffset: scrollTop });
    }
    if (scrollTop > 150 && newsHeightOffset < 150) {
      this.setState({ newsHeightOffset: 150 });
    }
  }

  render() {
    const { news, newsHeightOffset } = this.state;
    return (
      <Container className="main">
        <Title>News</Title>
        <Card>
          <NewsContainer onScroll={this.handleNewsScroll} heightOffset={newsHeightOffset}>
            {
              news.length > 0 ? this.generateNews() : (
                <Loading loadingText="Loading News" />
              )
            }
          </NewsContainer>
        </Card>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
`;

const NewsContainer = styled.div`
  height: ${({ heightOffset }) => 200 + heightOffset}px;
  margin: 2px 0;
  display: flex;
  flex-flow: column;
  overflow-y: scroll;
  overflow-x: hidden;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 100ms;
`;

const NewsItem = styled.div`
  display: flex;
  padding: 0 16px;
  min-height: 50px;
  align-items: center;
  border-bottom: 1px solid rgb(62, 77, 102);
  transition: all 150ms ease-in;
  cursor: pointer;
  &:hover {
    background: rgb(88, 101, 122);
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12);
    border-bottom: 1px solid transparent;
  }
  @media (max-width: 768px) {
    padding: 8px 16px;
  }
`;

const DateContainer = styled.div`
  min-width: 76px;
  margin-right: 16px;
`;

const NewsDate = styled.span`
  color: rgba(255, 255, 255, .3);
`;

const NewsTitle = styled.span`
  color: white;
  cursor: pointer;
`;



export default MemberArea;