import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { updatePaymentInfo } from '../store/index';
import { useCurrentUser } from '../utils/current_user';

const PaymentDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useCurrentUser();

  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('standard');

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(value.replace(/(.{4})/g, '$1 ').trim());
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiry(value);
  };

  const handlePlanChange = (e) => {
    setSelectedPlan(e.target.value);
  };

  const validateForm = () => {
    return name && cardNumber && expiry && cvv;
  };

  const handlePayment = async () => {
    if (!currentUser) {
      setPaymentStatus('User not logged in. Please log in to proceed.');
      return;
    }

    setIsPaying(true);
    setPaymentStatus('Payment is started... Thank you for your subscription!');
  
    const currentDate = new Date();
    const paymentDay = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
  
    let expireDay;
    if (selectedPlan === 'standard') {
      const expireDate = new Date(currentDate);
      expireDate.setMonth(expireDate.getMonth() + 6);
      expireDay = `${String(expireDate.getDate()).padStart(2, '0')}/${String(expireDate.getMonth() + 1).padStart(2, '0')}/${expireDate.getFullYear()}`;
    } else {
      const expireDate = new Date(currentDate);
      expireDate.setMonth(expireDate.getMonth() + 12);
      expireDay = `${String(expireDate.getDate()).padStart(2, '0')}/${String(expireDate.getMonth() + 1).padStart(2, '0')}/${expireDate.getFullYear()}`;
    }
  
    try {
      await dispatch(updatePaymentInfo({ email: currentUser, payment_day: paymentDay, expire_day: expireDay })).unwrap();
  
      setTimeout(() => {
        setPaymentStatus('Payment is finished. Directed to Aniflix');
        setIsPaying(false);
  
        setTimeout(() => {
          setPaymentStatus('');
          navigate('/');
        }, 3000);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setPaymentStatus('Payment failed. Please try again.');
      setIsPaying(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Payment Details</Title>
        {paymentStatus && <PaymentStatus>{paymentStatus}</PaymentStatus>}
        <Form>
          <Row>
            <InputContainer>
              <Label>Person Name</Label>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputContainer>
          </Row>
          <Row>
            <InputContainer>
              <Label>Card Number</Label>
              <Input
                type="text"
                placeholder="1234 5678 4356 7890"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
              />
            </InputContainer>
          </Row>
          <Row>
            <HalfColumn hasMargin>
              <InputContainer>
                <Label>Expiry</Label>
                <Input
                  type="text"
                  placeholder="MM/YYYY"
                  value={expiry}
                  onChange={handleExpiryChange}
                  required
                />
              </InputContainer>
            </HalfColumn>
            <HalfColumn>
              <InputContainer>
                <Label>CVV/CVC</Label>
                <Input
                  type="password"
                  placeholder="***"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                />
              </InputContainer>
            </HalfColumn>
          </Row>
          <Row>
            <InputContainer>
              <Label>Select Plan</Label>
              <Select
                value={selectedPlan}
                onChange={handlePlanChange}
              >
                <Option value="standard">Standard (6 months)</Option>
                <Option value="extended">Extended (1 year)</Option>
              </Select>
            </InputContainer>
          </Row>
          <Row>
            <Button 
              onClick={handlePayment} 
              disabled={!validateForm() || isPaying}
            >
              Pay ${selectedPlan === 'standard' ? '29' : '39'}
            </Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: black;
  padding: 30px 10px;
`;

const Card = styled.div`
  background-color: #ffffff;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
`;

const Title = styled.p`
  font-size: 30px;
  font-weight: 800;
  text-align: center;
  color: black;
  margin-bottom: 20px;
`;

const PaymentStatus = styled.p`
  text-align: center;
  color: #4caf50;
  margin-bottom: 20px;
`;

const Form = styled.div``;

const Row = styled.div`
  margin-bottom: 20px;
`;

const HalfColumn = styled.div`
  width: 48%;
  display: inline-block;
  vertical-align: top;
  margin-right: ${({ hasMargin }) => (hasMargin ? '4%' : '0')};
`;

const InputContainer = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #333333;
  font-size: 14px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid transparent;
  border-radius: 4px;
  background-color: #223C60;
  color: white;
  box-sizing: border-box;

  &::placeholder {
    color: white;
    font-size: 14px;
    font-weight: 600;
  }

  &:focus {
    border-color: #2d4dda;
    background-color: #0C4160;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 2px solid transparent;
  border-radius: 4px;
  background-color: #223C60;
  color: white;
  box-sizing: border-box;

  &:focus {
    border-color: #2d4dda;
    background-color: #0C4160;
    outline: none;
  }
`;

const Option = styled.option``;

const Button = styled.button`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background-image: linear-gradient(to right, #77A1D3 0%, #79CBCA 51%, #77A1D3 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-position 0.5s ease, transform 0.2s ease-in;
  background-size: 200% auto;

  &:disabled {
    background-color: #cccccc;
  }

  &:hover {
    background-position: right center;
  }

  .fas.fa-arrow-right {
    transition: transform 0.2s ease-in;
  }

  &:hover .fas.fa-arrow-right {
    transform: translate(15px);
  }
`;

export default PaymentDetails;
