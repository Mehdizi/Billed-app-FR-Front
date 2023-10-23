import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    );
    formNewBill.addEventListener("submit", this.handleSubmit);
    const file = this.document.querySelector(`input[data-testid="file"]`);
    file.addEventListener("change", this.handleChangeFile);
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    new Logout({ document, localStorage, onNavigate });
  }

  isValidExtension = (fileName) => {
    return (
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".png")
    );
  };

  // Probleme fileError et la classe file-error n'existent que dans la scope d'invalidite
  // Extraire le nom de la classe d'erreur, pour pouvoir la reutiliser
  // Si file error existe et que le file est toujours invalide, rien faire, mais effacer la nouvelle entree
  // Si le file error existe et que le file est valide, effacer le file error, et garder la valeur

  createFileError = () => {
    const fileContainer = document.getElementById("file-container");
    const fileError = document.createElement("span");
    fileError.classList.add("file-error");
    fileError.innerText =
      "Veuillez renseigner un fichier contenant l'extension .jpg, .jpeg ou .png";
    fileContainer.append(fileError);
  };

  resetValue = (e) => {
    e.target.value = "";
  };

  fileErrorText = () => {
    return this.document.querySelector(".file-error");
  };

  resetError = () => {
    if (this.fileErrorText()) {
      this.fileErrorText().remove();
    }
  };

  handleChangeFile = (e) => {
    e.preventDefault();
    const file = this.document.querySelector(`input[data-testid="file"]`)
      .files[0];
    const filePath = e.target.value.split(/\\/g);
    const fileName = filePath[filePath.length - 1];
    if (!this.isValidExtension(fileName) && this.fileErrorText()) {
      this.resetValue(e);
      return;
    }
    if (!this.isValidExtension(fileName)) {
      this.createFileError();
      this.resetValue(e);
      return;
    }
    this.resetError();

    const formData = new FormData();
    const email = JSON.parse(localStorage.getItem("user")).email;
    formData.append("file", file);
    formData.append("email", email);

    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true,
        },
      })
      .then(({ key, fileUrl, fileName }) => {
        //         {key: 'kZ9A4wJnyFRvRxxfwWLj2U', id: 27, email: 'employee@test.tld', fileName: 'JSBench_test.png', filePath: 'public\\c4b32475612301939321ba37125204ee', …}
        // createdAt
        // :
        // "2023-10-22T20:08:37.096Z"
        // email
        // :
        // "employee@test.tld"
        // fileName
        // :
        // "JSBench_test.png"
        // filePath
        // :
        // "public\\c4b32475612301939321ba37125204ee"
        // id
        // :
        // 27
        // key
        // :
        // "kZ9A4wJnyFRvRxxfwWLj2U"
        // updatedAt
        // :
        // "2023-10-22T20:08:37.096Z"
        // [[Prototype]]
        // :
        // Object

        console.log(fileUrl);
        this.billId = key;
        this.fileUrl = fileUrl;
        this.fileName = fileName;
      })
      .catch((error) => console.error(error));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      'e.target.querySelector(`input[data-testid="datepicker"]`).value',
      e.target.querySelector(`input[data-testid="datepicker"]`).value
    );
    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(
        e.target.querySelector(`input[data-testid="amount"]`).value
      ),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct:
        parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
        20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
        .value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };
    this.updateBill(bill);
    this.onNavigate(ROUTES_PATH["Bills"]);
  };

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => console.error(error));
    }
  };
}
