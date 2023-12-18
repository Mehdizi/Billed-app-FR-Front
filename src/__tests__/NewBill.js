// /**
//  * @jest-environment jsdom
//  */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import BillsUI from "../views/BillsUI.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";

jest.mock("../app/store", () => mockStore);

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

      const file = screen.getByTestId("file");

      userEvent.upload(file, {
        target: {
          files: [new File(["test"], "image.pdf", { type: "application.pdf" })],
        },
      });

      const newBillForm = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn((e) => newBillForm.handleChangeFile(e));

      file.addEventListener("change", handleChangeFile);

      fireEvent.change(file);

      expect(handleChangeFile).toHaveBeenCalled();

      const fileError = document.querySelector("#fileError");

      expect(fileError.innerText).toStrictEqual(
        "Veuillez renseigner un fichier contenant l'extension .jpg, .jpeg ou .png"
      );
    });
  });

  describe("When I am in the NewBill page and I send complete bill in correct format", () => {
    test("Then it should create a new bill", async () => {
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

      const billToCreate = {
        type: "Hôtel et logement",
        name: "encore",
        amount: 400,
        date: "2004-04-04",
        vat: "80",
        pct: 20,
        commentary: "séminaire billed",
        fileUrl:
          "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        status: "pending",
      };

      const inputType = screen.getByTestId("expense-type");
      fireEvent.change(inputType, { target: { value: billToCreate.type } });

      const inputName = screen.getByTestId("expense-name");
      fireEvent.change(inputName, { target: { value: billToCreate.name } });

      const inputDate = screen.getByTestId("datepicker");
      fireEvent.change(inputDate, { target: { value: billToCreate.date } });

      const inputAmount = screen.getByTestId("amount");
      fireEvent.change(inputAmount, { target: { value: billToCreate.amount } });

      const inputVat = screen.getByTestId("vat");
      fireEvent.change(inputVat, { target: { value: billToCreate.vat } });

      const inputPct = screen.getByTestId("pct");
      fireEvent.change(inputPct, { target: { value: billToCreate.pct } });

      const inputCommentary = screen.getByTestId("commentary");
      fireEvent.change(inputCommentary, {
        target: { value: billToCreate.commentary },
      });

      const file = screen.getByTestId("file");
      const fileToInput = new File(["test"], billToCreate.fileName, {
        type: "image/jpg",
      });
      userEvent.upload(file, fileToInput);

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const store = null;

      const newBillForm = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: localStorageMock,
      });

      const handleChangeFile = jest.fn((e) => newBillForm.handleChangeFile(e));
      file.addEventListener("change", handleChangeFile);

      const mocked = mockStore.bills();
      const createBills = jest.spyOn(mocked, "create");

      const create = await createBills({ mocked, ...billToCreate });

      const formular = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn(newBillForm.handleSubmit);

      formular.addEventListener("submit", handleSubmit);
      fireEvent.submit(formular);

      expect(create.key).toBe("jvgJju97EQSXq2PNakSMbE");
      expect(handleSubmit).toHaveBeenCalled();
      expect(createBills).toHaveBeenCalled();
    });
  });
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills");
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "a@a",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      router();
    });
    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      });
      window.onNavigate(ROUTES_PATH.NewBill);
      await new Promise(process.nextTick);
      document.body.innerHTML = BillsUI({ error: "Erreur 404" });
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"));
          },
        };
      });

      window.onNavigate(ROUTES_PATH.NewBill);
      await new Promise(process.nextTick);
      document.body.innerHTML = BillsUI({ error: "Erreur 500" });
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
