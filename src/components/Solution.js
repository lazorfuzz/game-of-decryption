import styled from 'styled-components';

const SolutionContainer = styled.div`
  margin-bottom: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TR = styled.tr`
  padding: 4px 0;
  border-bottom: 1px solid rgb(62, 77, 102);
  ${({ bodyRow }) => bodyRow && 'height: 60px;'}
`;

const TBody = styled.tbody`
  width: 100%;
`;

const TH = styled.th`
  color: rgba(255, 255, 255, .9);
  font-weight: 300;
  font-size: 1.1em;
  width: ${({ small }) => small ? '10%' : '45%'};
  padding: 8px 0;
  @media (max-width: 415px) {
    width: ${({ small }) => small ? '15%' : '40%'};
  }
`;

const TD = styled.td`
  color: rgba(255, 255, 255, .6);
  text-align: center;
  padding: 16px 8px;
`;

const SolutionOptions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 2px 8px;
`;

export default SolutionContainer;
export { Table, TR, TH, TD, TBody, SolutionOptions };
