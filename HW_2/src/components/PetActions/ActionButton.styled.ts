import styled from 'styled-components';

export const ActionButton = styled.button`
  background-color: #000000;
  color: #fff566;
  border: 2px solid #000000;
  padding: 8px 16px;
  border-radius: 0;
  cursor: pointer;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.1s;
  margin-right: 8px;
  margin-bottom: 8px;
  box-shadow: 3px 3px 0px rgba(0,0,0,0.2);

  &:hover {
    background-color: #1f1f1f;
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 4px 4px 0px rgba(0,0,0,0.3);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 1px 1px 0px rgba(0,0,0,0.2);
  }

  &:disabled {
    background-color: #e0e0e0;
    color: #999;
    border-color: #e0e0e0;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;
