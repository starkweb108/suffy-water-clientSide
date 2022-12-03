import React, { useState, useEffect } from 'react';

import CollectInputsValue from '../../components/inputs/CollectInputsValue';
import Modal from '../../components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal, toggleAlert } from '../../features/order/orderSlice';
import PreloaderSmall from '../../components/PreloaderSmall';
import Alert from '../../components/Alert';
import { useCreateOrderMutation } from '../../services/ordersApi';
import Navbar from '../../components/navbar/Navbar';
import HomePageSidebar from '../../components/HomePageSidebar';
import { updateIsPending } from '../../features/admin/adminSlice';

const PlaceOrder = () => {
  const [orderInformation, setOrderInformation] = useState({
    numOfPacks: '',
    numOfBags: '',
    name: '',
    deliveryAddress: '',
    phoneNumber: '',
    location: '',
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const { modal, alert, isSidebarOpen } = useSelector((state) => state.order);
  const { isPending } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  // ++++++++
  const [createOrderMutation] = useCreateOrderMutation();
  // +++++++++++++++
  const handleInputs = (e) => {
    const { name, value } = e.target;
    setOrderInformation((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  };
  useEffect(() => {
    setTotalAmount(
      Number(orderInformation.numOfBags) * Number(200) +
        Number(orderInformation.numOfPacks) * Number(800)
    );
  }, [orderInformation]);

  //   convert number to currency string
  const formatter = new Intl.NumberFormat();

  // ++++++++++++++++++++++++

  // submit orderInformation to data base

  const handleSubmit = async () => {
    if (
      !orderInformation.name ||
      !orderInformation.deliveryAddress ||
      !orderInformation.phoneNumber ||
      !orderInformation.location
    ) {
      dispatch(
        toggleAlert({
          showAlert: true,
          message: 'Please provide the required values',
        })
      );
      return;
    }
    dispatch(updateIsPending(true));

    const response = await createOrderMutation({
      orderInformation,
      totalAmount,
    });

    if (response.data) {
      dispatch(
        toggleModal({
          open: true,
          message: response?.data?.message,
          order: response?.data?.order,
        })
      );
      setOrderInformation({
        numOfBags: '',
        numOfPacks: '',
        phoneNumber: '',
        location: '',
        deliveryAddress: '',
        name: '',
      });
      dispatch(updateIsPending(false));
      return;
    }

    if (response.error.data.message) {
      dispatch(updateIsPending(false));
      dispatch(
        toggleAlert({
          showAlert: true,
          message: response.error.data.message,
        })
      );
    } else if (response.error.status === 'FETCH_ERROR' || response.error.data) {
      dispatch(updateIsPending(false));
      dispatch(
        toggleAlert({
          showAlert: true,
          message: 'Network Error try again later',
        })
      );
    }
  };

  return (
    <>
      <Navbar />
      {isSidebarOpen && <HomePageSidebar />}
      {alert.showAlert && <Alert />}
      {modal.open && <Modal />}
      <div className="form--container">
        <div className="ocean">
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="place--order--form--container"
        >
          {/* ======================================== */}
          <div className="item--order">
            <img src={require('../../assets/images/bags.jpg')} alt="bags" />{' '}
            <p>
              Number of bags <br /> 50cl sachet
            </p>
          </div>
          <section className="quantity--container">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {' '}
              <input
                name="numOfBags"
                type="number"
                value={orderInformation.numOfBags}
                onChange={handleInputs}
                placeholder="0"
              />
              <p>X 200</p>
            </div>
            <p>
              {' '}
              &#8358;
              {formatter.format(
                Number(orderInformation.numOfBags) * Number(200)
              )}
            </p>
          </section>
          {/* ============================================== */}
          {/* +++++++++++++++++++++++++++++++++++++++++++ */}
          {/* +++++++++++++++++++++++++++++++++++++++++++ */}
          {/* ======================================== */}
          <div className="item--order">
            <img src={require('../../assets/images/packs.jpg')} alt="packs" />
            <p>
              Number of packs <br /> 75cl bottle
            </p>
          </div>

          <section className="quantity--container">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {' '}
              <input
                name="numOfPacks"
                type="number"
                value={orderInformation.numOfPacks}
                onChange={handleInputs}
                placeholder="0"
              />
              <p>X 800</p>
            </div>
            <p>
              {' '}
              &#8358;
              {formatter.format(
                Number(orderInformation.numOfPacks) * Number(800)
              )}
            </p>
          </section>
          {/* ============================================== */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '0.7em 0',
            }}
          >
            <b> Total: </b>
            <span>
              <b>&#8358;{formatter.format(totalAmount)} </b>
            </span>
          </div>
          <p>Contact information</p>
          <p>
            Name
            <sup
              style={{
                color: 'red',
              }}
            >
              *
            </sup>
          </p>
          <CollectInputsValue
            value={orderInformation.name}
            name="name"
            label="Name"
            type="text"
            handleInputs={handleInputs}
          />
          <p>
            Location
            <sup
              style={{
                color: 'red',
              }}
            >
              *
            </sup>
          </p>
          <select
            name="location"
            value={orderInformation.location}
            onChange={handleInputs}
          >
            <option value="">--select your location--</option>
            <option value="Abuja"> Abuja</option>
            <option value="Estako-west">Estako west</option>
          </select>
          <p>
            Delivery Address
            <sup
              style={{
                color: 'red',
              }}
            >
              *
            </sup>
          </p>
          <CollectInputsValue
            name="deliveryAddress"
            label="Delivery Address"
            type="text"
            value={orderInformation.deliveryAddress}
            handleInputs={handleInputs}
          />
          <p>
            Phone Number
            <sup
              style={{
                color: 'red',
              }}
            >
              *
            </sup>
          </p>
          <CollectInputsValue
            name="phoneNumber"
            type="tel"
            value={orderInformation.phoneNumber}
            handleInputs={handleInputs}
          />
          <button onClick={handleSubmit} disabled={isPending}>
            {!isPending ? <span>Confirm Order</span> : <PreloaderSmall />}
          </button>
          <p style={{ textAlign: 'center' }}>
            {' '}
            We currently only support payment on delivery.
          </p>
        </form>
      </div>
    </>
  );
};

export default PlaceOrder;
