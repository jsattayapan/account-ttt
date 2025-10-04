import React, { useState } from "react";
import "./soldItems.css"; // Add CSS for styling


export const SoldItems = props => {


    const transformLists = (customer, vip, staff) => {
        const combinedMap = new Map();

        // Helper function to add items to the map
        const addToMap = (list, type) => {
          list.forEach(({ code, name, cat, qty }) => {
            if (!combinedMap.has(code)) {
              combinedMap.set(code, {
                code,
                name,
                cat,
                customerQuantity: 0,
                vipQuantity: 0,
                staffQuantity: 0,
                totalQuantity: 0,
              });
            }
            const entry = combinedMap.get(code);
            entry[`${type}Quantity`] += qty;
            entry.totalQuantity += qty;
          });
        };

        // Add data from each list to the map
        addToMap(customer, "customer");
        addToMap(vip, "vip");
        addToMap(staff, "staff");

        // Convert map values to an array
        return Array.from(combinedMap.values());
      };


      const soldItems = transformLists(props.data.customerSum, props.data.vipSum , props.data.staffSum)

    return (
            <div className="tablez-container">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Category</th>
                  <th>Name</th>
                  <th>Customer</th>
                  <th>VIP</th>
                  <th>Employee</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {
                    soldItems.map(item => (
                        <tr>
                        <td>{item.code}</td>
                        <td>{item.cat}</td>
                        <td>{item.name}</td>
                        <td>{item.customerQuantity}</td>
                        <td>{item.vipQuantity}</td>
                        <td>{item.staffQuantity}</td>
                        <td>{item.totalQuantity}</td>
                      </tr>
                    ))
                }

              </tbody>
            </table>
            </div>)

}

export default SoldItems;
