/**
 * @jest-environment jsdom
 */

import { screen, waitFor, FireFunction, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import NewBillUI from "../views/NewBillUI.js";
import { bills } from "../fixtures/bills.js";
import Bills from "../containers/Bills.js";
import NewBill from "../containers/NewBill.js";
import Logout from "../containers/Logout.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { sortBills } from "../app/sortBills.js";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      expect(
        document
          .querySelector("#layout-icon1")
          .className.includes("active-icon")
      ).toBeTruthy();
    });

    test("Then bills should be ordered from earliest to latest", () => {
      expect(sortBills(bills)).toStrictEqual([
        {
          id: "47qAXb6fIm2zOKkLzMro",
          vat: "80",
          fileUrl:
            "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
          status: "pending",
          type: "Hôtel et logement",
          commentary: "séminaire billed",
          name: "encore",
          fileName: "preview-facture-free-201801-pdf-1.jpg",
          date: "2004-04-04",
          amount: 400,
          commentAdmin: "ok",
          email: "a@a",
          pct: 20,
        },
        {
          id: "UIUZtnPQvnbFnB0ozvJh",
          name: "test3",
          email: "a@a",
          type: "Services en ligne",
          vat: "60",
          pct: 20,
          commentAdmin: "bon bah d'accord",
          amount: 300,
          status: "accepted",
          date: "2003-03-03",
          commentary: "",
          fileName:
            "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
          fileUrl:
            "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3",
        },
        {
          id: "qcCK3SzECmaZAGRrHjaC",
          status: "refused",
          pct: 20,
          amount: 200,
          email: "a@a",
          name: "test2",
          vat: "40",
          fileName: "preview-facture-free-201801-pdf-1.jpg",
          date: "2002-02-02",
          commentAdmin: "pas la bonne facture",
          commentary: "test2",
          type: "Restaurants et bars",
          fileUrl:
            "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732",
        },
        {
          id: "BeKy5Mo4jkmdfPGYpTxZ",
          vat: "",
          amount: 100,
          name: "test1",
          fileName: "1592770761.jpeg",
          commentary: "plop",
          pct: 20,
          type: "Transports",
          email: "a@a",
          fileUrl:
            "https://test.storage.tld/v0/b/billable-677b6.a…61.jpeg?alt=media&token=7685cd61-c112-42bc-9929-8a799bb82d8b",
          date: "2001-01-01",
          status: "refused",
          commentAdmin: "en fait non",
        },
      ]);
    });
    describe("When I click on the new bill button", () => {
      test(" then it should open the newBill page", () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });

        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );

        document.body.innerHTML = BillsUI(bills);

        const btnNewBill = screen.queryByTestId("btn-new-bill");
        // Recuperation de la page BillsUI et première vérification que le bouton pour ajouter une bill est présent
        expect(btnNewBill).toBeTruthy();

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const store = null;

        const employeeDashboard = new Bills({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });

        const handleClickNewBill = jest.fn((e) =>
          employeeDashboard.handleClickNewBill()
        );
        btnNewBill.addEventListener("click", handleClickNewBill);
        fireEvent.click(btnNewBill);
        // Ici on s'assure que la fonction de changement de page est correctement lancée
        expect(handleClickNewBill).toHaveBeenCalled();
        const formNewBill = screen.getByTestId("form-new-bill");
        // On s'assure que le formulaire apparait bien et que la page est bien chargée
        expect(formNewBill).toBeTruthy();
      });
      test("Then the main icon in the layout should be highlighted", () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.NewBill);
        expect(
          document
            .querySelector("#layout-icon2")
            .className.includes("active-icon")
        ).toBeTruthy();
      });
    });
    describe("When I click on the eye icon of a bill", () => {
      // test("Then it should open the justificatif modal", () => {
      //   Object.defineProperty(window, "localStorage", {
      //     value: localStorageMock,
      //   });
      //   window.localStorage.setItem(
      //     "user",
      //     JSON.stringify({
      //       type: "Employee",
      //     })
      //   );
      //   const loading = false;
      //   const error = false;
      //   document.body.innerHTML = BillsUI({ data: bills, loading, error });
      //   expect(screen.getAllByTestId("icon-eye")).toBeTruthy();
      //   const onNavigate = (pathname) => {
      //     document.body.innerHTML = ROUTES({ pathname });
      //   };
      //   const store = null;
      //   const eyeIcons = screen.getAllByTestId("icon-eye");
      //   const employeeDashboard = new Bills({
      //     document,
      //     onNavigate,
      //     store,
      //     localStorage: window.localStorage,
      //   });
      //   const handleClickIconEye = jest.fn((e) => {
      //     employeeDashboard.handleClickIconEye({ icon: eyeIcons });
      //   });
      //   eyeIcons.forEach((icon) => {
      //     icon.addEventListener("click", () => handleClickIconEye(icon));
      //   });
      //   fireEvent.click(eyeIcons[0]);
      //   expect(handleClickIconEye).toHaveBeenCalled();
      // });
    });
  });
});

// tester si le mail est bien en surbrillance une fois la page ouverte = OK
// cliquer sur new bill ouvre bien la page de newbill = OK
// cliquer sur l'oeil ouvre bien le modal pour visualiser le justificatif
