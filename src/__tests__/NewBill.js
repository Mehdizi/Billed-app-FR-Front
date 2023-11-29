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
import { bills } from "../fixtures/bills.js";
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

      const newBillForm = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });

      const handleChangeFile = jest.fn(() => newBillForm.handleChangeFile);

      const file = screen.getByTestId("file");

      file.addEventListener("change", handleChangeFile);

      const fileToInput = new File(["test"], "test.pdf", {
        type: "application/pdf",
      });

      userEvent.upload(file, fileToInput);

      expect(handleChangeFile).toHaveBeenCalled();

      const fileError = document.querySelector("#fileError");

      expect(fileError.innerText).toStrictEqual(
        "Veuillez renseigner un fichier contenant l'extension .jpg, .jpeg ou .png"
      );
    });
  });

  describe("When I am in the NewBill page and I send complete bill in correct format", () => {
    test.only("Then it should create a new bill", () => {
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

      // récupérer les données du formulaire en y attribuant une value pour chaque input
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
      const fileToInput = new File(["test"], "test.jpg", {
        type: "image/jpg",
      });
      userEvent.upload(file, fileToInput);

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBillForm = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });

      console.log("file", file);

      expect(file).toBeTruthy();
    });
  });
});

/**
 * @jest-environment jsdom
 */

// import { fireEvent, screen, waitFor } from "@testing-library/dom";
// import NewBillUI from "../views/NewBillUI.js";
// import NewBill from "../containers/NewBill.js";
// import router from "../app/Router.js";
// import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
// import mockStore from "../__mocks__/store";
// import { localStorageMock } from "../__mocks__/localStorage.js";
// import BillsUI from "../views/BillsUI.js";

// describe("Given I am connected as an employee", () => {
//   describe("When I am on NewBill Page and I upload file", () => {
//     test("should render an error if the extensions is not jpg, jpeg or png", () => {
//       Object.defineProperty(window, "localStorage", {
//         value: localStorageMock,
//       });
//       window.localStorage.setItem(
//         "user",
//         JSON.stringify({
//           type: "Employee",
//         })
//       );

//       document.body.innerHTML = NewBillUI();

//       const uploader = screen.getByTestId("file");
//       fireEvent.change(uploader, {
//         target: {
//           files: [new File(["image"], "image.pdf", { type: "image/png" })],
//         },
//       });

//       console.log("uploader", uploader.files[0].name);

//       const onNavigate = (pathname) => {
//         document.body.innerHTML = ROUTES({ pathname });
//       };

//       const newBills = new NewBill({
//         document,
//         onNavigate,
//         store: mockStore,
//         localStorage: window.localStorage,
//       });

//       expect(uploader.files[0].name).toBe("image.png");
//       expect(uploader.files[0].name).toMatch(/(jpeg|jpg|png)/);

//       // const handleChangeFile = jest.fn(() => newBills.handleChangeFile);

//       // uploader.addEventListener("change", handleChangeFile);
//       // fireEvent.change(uploader);

//       // expect(handleChangeFile).toHaveBeenCalled();
//     });
//   });

//   describe("When I am on NewBill Page and I add a new Bill POST", () => {
//     test("should added newBill POST", async () => {
//       Object.defineProperty(window, "localStorage", {
//         value: localStorageMock,
//       });
//       window.localStorage.setItem(
//         "user",
//         JSON.stringify({
//           type: "Employee",
//           email: "employee@test.tld",
//         })
//       );

//       document.body.innerHTML = NewBillUI();

//       const inputData = {
//         type: "Hôtel et logement",
//         name: "encore",
//         amount: "400",
//         date: "2004-04-04",
//         vat: "80",
//         pct: "20",
//         commentary: "séminaire billed",
//         fileUrl:
//           "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
//         fileName: "preview-facture-free-201801-pdf-1.jpg",
//         status: "pending",
//       };

//       const inputType = screen.getByTestId("expense-type");
//       fireEvent.change(inputType, { target: { value: inputData.type } });
//       expect(inputType.value).toBe(inputData.type);

//       const inputName = screen.getByTestId("expense-name");
//       fireEvent.change(inputName, { target: { value: inputData.name } });
//       expect(inputName.value).toBe(inputData.name);

//       const inputDate = screen.getByTestId("datepicker");
//       fireEvent.change(inputDate, { target: { value: inputData.date } });
//       expect(inputDate.value).toBe(inputData.date);

//       const inputAmount = screen.getByTestId("amount");
//       fireEvent.change(inputAmount, { target: { value: inputData.amount } });
//       expect(inputAmount.value).toBe(inputData.amount);

//       const inputVat = screen.getByTestId("vat");
//       fireEvent.change(inputVat, { target: { value: inputData.vat } });
//       expect(inputVat.value).toBe(inputData.vat);

//       const inputPct = screen.getByTestId("pct");
//       fireEvent.change(inputPct, { target: { value: inputData.pct } });
//       expect(inputPct.value).toBe(inputData.pct);

//       const inputCommentary = screen.getByTestId("commentary");
//       fireEvent.change(inputCommentary, {
//         target: { value: inputData.commentary },
//       });
//       expect(inputCommentary.value).toBe(inputData.commentary);

//       const onNavigate = (pathname) => {
//         document.body.innerHTML = ROUTES({ pathname });
//       };

//       const store = null;

//       const newBills = new NewBill({
//         document,
//         onNavigate,
//         store,
//         localStorage,
//       });

//       const getlocalStorage = localStorage.getItem("user");
//       const localStorageparse = JSON.parse(getlocalStorage);
//       const email = JSON.parse(localStorageparse).email;

//       const mocked = mockStore.bills();
//       const createBills = jest.spyOn(mocked, "create");

//       const create = await createBills({ email, ...inputData });

//       const formNewBill = screen.getByTestId("form-new-bill");
//       const handleSubmit = jest.fn(newBills.handleSubmit);

//       formNewBill.addEventListener("submit", handleSubmit);
//       fireEvent.submit(formNewBill);

//       expect(create.key).toBe("jvgJju97EQSXq2PNakSMbE");
//       expect(create.email).toBe("employee@test.tld");

//       expect(handleSubmit).toHaveBeenCalled();
//       expect(createBills).toHaveBeenCalled();
//       expect(formNewBill).toBeTruthy();
//     });
//   });
// });
