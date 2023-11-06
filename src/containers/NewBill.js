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

  createFileError = () => {
    const fileContainer = document.getElementById("file-container");
    const fileError = document.createElement("span");
    fileError.id = "fileError";
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

    this.file = file;
    this.fileUrl = filePath;
    this.fileName = fileName;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", JSON.parse(localStorage.getItem("user")).email);
    formData.append("fileUrl", this.fileUrl);
    formData.append("file", this.file);
    formData.append("fileName", this.fileName);
    formData.append(
      "type",
      e.target.querySelector(`select[data-testid="expense-type"]`).value
    );
    formData.append(
      "name",
      e.target.querySelector(`input[data-testid="expense-name"]`).value
    );
    formData.append(
      "amount",
      parseInt(e.target.querySelector(`input[data-testid="amount"]`).value)
    );
    formData.append(
      "date",
      e.target.querySelector(`input[data-testid="datepicker"]`).value
    );
    console.log(
      "date :",
      e.target.querySelector(`input[data-testid="datepicker"]`).value
    );
    formData.append(
      "vat",
      e.target.querySelector(`input[data-testid="vat"]`).value
    );
    formData.append(
      "pct",
      parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20
    );
    formData.append(
      "commentary",
      e.target.querySelector(`textarea[data-testid="commentary"]`).value
    );
    formData.append("status", "pending");

    console.log(formData);

    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true,
        },
      })
      .catch((error) => console.error(error))
      .then(() => {
        this.onNavigate(ROUTES_PATH["Bills"]);
      });
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
