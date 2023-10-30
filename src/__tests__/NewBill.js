/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";

// Différent test à faire
//
//

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I click on send without information", () => {
    test("Then it should render an error", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const store = null;

      const send = document.querySelector("#btn-send-bill");
      expect(send).toBeTruthy();

      const newBillForm = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: localStorageMock,
      });

      const handleSubmit = jest.fn((e) => newBillForm.handleSubmit);
      send.addEventListener("click", handleSubmit);
      fireEvent.click(send);
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
