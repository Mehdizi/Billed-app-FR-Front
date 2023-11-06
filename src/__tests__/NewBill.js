/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { bills } from "../fixtures/bills.js";
import userEvent from "@testing-library/user-event";
import { createEvent } from "@testing-library/dom";
import Store from "../app/Store.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on the formular and I choose a file in wrong format", () => {
    test("Then it should render me an error", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;

      new NewBill({
        document,
        onNavigate,
        store,
        localStorage: localStorageMock,
      });

      const file = screen.getByTestId("file");

      fireEvent.change(
        file,
        createEvent("file", file, {
          target: {
            files: [new File(["l,k,lk,"], "logo_les_petits_plats.pdf")],
          },
        })
      );

      const fileError = document.querySelector(".file-error");

      expect(fileError).toBeTruthy();
    });
  });
  describe("When I am in the NewBill page and I send complete bill", () => {
    test("Then it should update the bill", () => {
      // récupérer les données du formulaire en y attribuant une value pour chaque input
      const html = NewBillUI();
      document.body.innerHTML = html;
      const typeBill = screen.getByTestId("expense-type");
      fireEvent.change(typeBill, {
        target: { option: { value: "Transport" } },
      });
      console.log("type value :", typeBill.value);
      const nameBill = screen.getByTestId("expense-name");
      fireEvent.change(nameBill, { target: { value: "test" } });
      console.log("name value :", nameBill.value);
      const dateBill = screen.getByTestId("datepicker");
      fireEvent.change(dateBill, { target: { value: "2020-05-24" } });
      console.log("date value :", dateBill.value);
      const amountBill = screen.getByTestId("amount");
      fireEvent.change(amountBill, { target: { value: 200 } });
      console.log("amount value :", amountBill.value);
      const vatBill = screen.getByTestId("vat");
      fireEvent.change(vatBill, { target: { value: 70 } });
      console.log("vat value :", vatBill.value);
      const pctBill = screen.getByTestId("pct");
      fireEvent.change(pctBill, { target: { value: 20 } });
      console.log("pct value :", pctBill.value);
      const commentaryBill = screen.getByTestId("commentary");
      fireEvent.change(commentaryBill, { target: { value: "test" } });
      console.log("commentary value :", commentaryBill.value);
      const fileBill = screen.getByTestId("file");
      fireEvent.change(
        fileBill,
        createEvent("file", fileBill, {
          target: {
            files: [
              new File(["5555"], "logo_les_petits_plats.png", {
                type: "image/png",
              }),
            ],
          },
        })
      );
      console.log("file value :", fileBill);
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = jest.fn();

      const newBillForm = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: localStorageMock,
      });

      newBillForm.handleSubmit(send);
    });
  });
});
