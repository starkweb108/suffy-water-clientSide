import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  useGetAllOrdersMutation,
  useGetSingleOrderMutation,
} from "../../services/ordersApi";
import {
  updateSingleOrder,
  updateOrders,
  updateOrderId,
} from "../../features/order/orderSlice";
import SingleOrder from "./SingleOrder";
import PreloaderLarge from "../PreloaderLarge";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Pagination from "./Pagination";
import SearchOrderWithID from "./SearchOrderWithID";

TimeAgo.addDefaultLocale(en);
const AdminPageContent = () => {
  const { admin } = useSelector((state) => state.admin);
  const { singleOrder, orderStatus, orders, page, showSearchOrderById } =
    useSelector((state) => state.order);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [getAllOrdersMutation] = useGetAllOrdersMutation();
  const [getSingleOrderMutation] = useGetSingleOrderMutation();
  const dispatch = useDispatch();

  const timeAgo = new TimeAgo("en-US");

  // ++++++++++++++++++++++++++++
  const getAllOrders = async () => {
    setLoadingOrders(true);
    const response = await getAllOrdersMutation({
      orderStatus,
      page,
    });

    dispatch(updateOrders(response?.data));
    setLoadingOrders(false);
  };

  useEffect(() => {
    getAllOrders();
  }, [page, orderStatus]);
  // +===========================

  const getSingleOrder = async (id) => {
    const result = await getSingleOrderMutation(id);
    if (result.data) {
      dispatch(
        updateSingleOrder({
          isShown: true,
          order: result?.data?.order,
        })
      );
    } else {
      console.log("error occured");
    }
  };

  return (
    <div className="admin--page--content">
      <h2 style={{ textAlign: "center" }}>{admin?.user?.location}</h2>

      {loadingOrders ? (
        <PreloaderLarge />
      ) : showSearchOrderById ? (
        <SearchOrderWithID />
      ) : !singleOrder.isShown ? (
        <>
          {orders?.orders?.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                marginTop: "10rem",
              }}
            >
              <h3>Sorry No {orderStatus} orders</h3>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Name</th>
                  <th>DeliveryAddress</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {orders?.orders?.map((item, index) => (
                  <tr onClick={() => getSingleOrder(item._id)} key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.deliveryAddress}</td>
                    <td>{item.location}</td>
                    <td
                      style={{
                        color: `${
                          item.status === "pending"
                            ? "orange"
                            : item.status === "fulfilled"
                            ? "#62C370"
                            : item.status === "cancelled" && "red"
                        }`,
                      }}
                    >
                      {item.status}
                    </td>
                    <td>
                      {timeAgo.format(new Date(item?.createdAt || Date.now()))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <SingleOrder />
      )}
      {orders?.totalOrders <= 20 || (!singleOrder.isShown && <Pagination />)}
    </div>
  );
};

export default AdminPageContent;
