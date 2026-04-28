import styled from "styled-components";
import { Button, Input, Select, Space, Steps } from "antd";
const StyledInput = styled(Input)`
  width: 100% !important;
  height: 3rem !important;
  font-size: 1rem !important;
  color: black !important;
  border-radius: 0.6rem !important;
  padding-left: 2rem !important;
  padding-right: 2rem !important;
  direction: rtl;
  text-align: right;
  input::placeholder {
    color: black !important;
    opacity: 0.6 !important;
    font-size: 1rem !important;
  }
  &::placeholder {
    color: black !important;
    opacity: 0.6 !important;
    font-size: 1rem !important;
  }

  &.ant-input-compact-item:not(:last-child) {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
`;
const StyledPriceInput = styled(Input)`
  width: 100% !important;
  height: 3rem !important;
  font-size: 1rem !important;
  color: black !important;
  border-radius: 0.6rem !important;
  padding-left: 2rem !important;
  direction: rtl;
  text-align: right;

  &.ant-input-compact-item:not(:last-child) {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  input::placeholder {
    color: black !important;
    opacity: 0.6 !important;
    font-size: 1rem !important;
  }
`;
const StyledButton = styled(Button)`
  height: 3rem !important;
  font-size: 1rem !important;
  color: black !important;
  border-radius: 0.6rem 0 0 0.6rem !important;
`;
const StyledSelect = styled(Select)`
  width: 100% !important;
  height: 3rem !important;
  color: black !important;

  .ant-select-selector {
    border-radius: 0.6rem !important;
    padding-left: 2rem !important;
    padding-right: 2rem !important;
    font-size: 1rem !important;
  }

  &.ant-select-compact-item:not(:first-child) .ant-select-selector {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  .ant-select-arrow {
    color: black !important;
    margin-left: 1rem;
  }

  .ant-select-clear {
    margin-left: 1rem;
  }

  .ant-select-selection-placeholder {
    color: black !important;
    opacity: 0.6 !important;
  }
`;
const StyledSpaceCompact = styled(Space.Compact)`
  width: 100% !important;
`;

const StyledTextArea = styled(Input.TextArea)`
  width: 100% !important;
  height: 3rem !important;
  font-size: 1rem !important;
  color: black !important;
  border-radius: 0.6rem !important;
  padding: 1rem 2rem !important;
  max-height: 10rem !important;
  height: 10rem !important;
  resize: none !important;
  direction: rtl;
  text-align: right;
  &::placeholder {
    color: black !important;
    opacity: 0.5 !important;
    font-size: 1rem !important;
  }
`;

const StyledStepContent = styled.div`
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 0.6rem !important;
  border: 1px dashed rgba(0, 0, 0, 0.2) !important;
  margin-top: 2rem !important;
  @media (min-width: 1200px) {
    padding: 3rem !important;
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    padding: 3rem !important;
  }

  @media (min-width: 768px) and (max-width: 991px) {
    padding: 2rem !important;
  }

  @media (min-width: 480px) and (max-width: 767px) {
    padding: 2rem !important;
    .ant-alert {
      width: 100% !important;
      max-width: 100% !important;
    }
  }

  @media (max-width: 479px) {
    padding: 1rem !important;
  }
`;
const StyledSteps = styled(Steps)`
  align-items: center;

  .ant-steps-item-title {
    font-size: 1.2rem !important;
    transition: all 0.4s ease !important;
  }
  .ant-steps-item-title::after {
    display: flex !important;
    margin-right: 2rem !important;
    margin-top: 0.7rem !important;
    transition: all 0.4s ease !important;
  }

  .ant-steps-item-container {
    display: flex !important;
    align-items: center !important;
  }
  .ant-steps-item-icon {
    padding: 0.8rem !important;
    border-radius: 100% !important;
    height: 4rem !important;
    width: 4rem !important;
    transition: all 0.4s ease !important;

    background-color: rgba(0, 0, 0, 0.06) !important;
    svg {
      color: black !important;
      line-height: 0 !important;
      margin-top: 0.2rem !important;
    }
  }
  .ant-steps-item-active {
    .ant-steps-item-icon {
      background-color: #ffe800 !important;
    }
  }
  .ant-steps-item-description {
    transition: all 0.4s ease !important;
  }
  .ant-steps-item-finish {
    .ant-steps-item-icon {
      background-color: #ffe800 !important;
      opacity: 0.6 !important;
    }
    .ant-steps-item-title {
      opacity: 0.6 !important;
    }
  }
  @media (min-width: 768px) and (max-width: 991px) {
    flex-direction: row !important;
    flex-wrap: wrap !important;
    align-items: center;
  }

  @media (min-width: 480px) and (max-width: 767px) {
    flex-direction: row !important;
    flex-wrap: wrap !important;
    align-items: start;
    gap: 1rem;
    .ant-steps-item {
      padding: 0 !important;
      .ant-steps-item-title::after {
        display: none !important;
      }
    }

    & > * {
      flex: 0 1 calc(25% - 1rem);
      min-width: 30% !important;
    }
    .ant-steps-item {
      .ant-steps-item-tail {
        display: none !important;
      }
      .ant-steps-item-tail::after {
        display: none !important;
      }
      .ant-steps-item-description {
        padding-bottom: 0 !important;
      }
    }
  }
  @media (min-width: 200px) and (max-width: 479px) {
    flex-direction: column !important;
    align-items: start;
    gap: 1rem;
    .ant-steps-item {
      padding: 0 !important;
      .ant-steps-item-title::after {
        display: none !important;
      }
      .ant-steps-item-container {
        display: flex;
        align-items: center !important;
      }
    }
    .ant-steps-item-description {
      padding-bottom: 0 !important;
    }
    .ant-steps-item {
      .ant-steps-item-tail {
        display: none !important;
      }
      .ant-steps-item-tail::after {
        display: none !important;
      }
    }
  }
`;
export {
  StyledInput,
  StyledPriceInput,
  StyledSelect,
  StyledSpaceCompact,
  StyledTextArea,
  StyledButton,
  StyledStepContent,
  StyledSteps,
};
