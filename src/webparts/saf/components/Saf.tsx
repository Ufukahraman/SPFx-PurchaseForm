import * as React from "react";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import styles from "./Saf.module.scss";
import { ISafProps } from "./ISafProps";
import html2canvas from "html2canvas";
import { BaseButton, DefaultButton } from "@fluentui/react/lib/Button";
import jsPDF from "jspdf";
import {
  DetailsListCompactExample,
  IDetailsListCompactExampleItem,
} from "./DetailsListCompactExample";
import { ComboBoxVirtualizedExample } from "./TedarikciCb";
import { ComboBoxVirtualizedExample2 } from "./MasrafCb";
import axios from 'axios';
import { MYModal } from "./MYModal";
import { DetailsList, SelectionMode } from "@fluentui/react/lib/DetailsList";






interface IRow {
  id: number;
  alinacakMalzeme: string;
  adet: string;
  birim: string;
  total: string;
  birim2: string;
  total2: string;
  birim3: string;
  total3: string;
}


export default class Saf extends React.Component<ISafProps, any> {
  fileInput: any;
  constructor(props: ISafProps, state: any) {
    super(props);

    this.state = {

      selectedId: "",
      selectedYil: "",
      selectedAy: "",
      selectedButceKodu: "",
      selectedTutar: "",
      selectedAltkod: "",
      selectedUstkod: "",
      selectedDescription: "",
      selectedControl: "",

      rows: [
        {

          id: 1,
          alinacakMalzeme: "",
          adet: "",
          birim: "",
          total: "",
          birim2: "",
          total2: "",
          birim3: "",
          total3: "",
        },
      ],

      aciklama: "",
      totalSum: "",
      totalSum2: "",
      totalSum3: "",
      indirimsonrasi: "",
      indirimsonrasi2: "",
      indirimsonrasi3: "",
      indirim: "",
      indirim2: "",
      indirim3: "",
      items: "",
      vade: "",
      sonToplam: "",
      rezerveedilen: "",
      onaybutcesi: "",
      sifno: "",
      secilentedarikci: "",
      tedarikci1: "",
      tedarikci2: "",
      tedarikci3: "",
      secilendosya: "",
      selectedFileName: "",
      parabirimi: "TL",
      filteredmm: "",
      filteredbk: "",
      kur: "1",
      checkedValue: null,
      isVisible: true,
      modaliac: false,
      secilimasrafmerkeziList: [],
      secilibutcekoduList: [],
      masrafMerkeziList: [],
      tummasrafMerkeziList: [],
      tedarikcilistesi: [],
      tedtumlist: [],
      parabirimleri: [],
      col: [
        {
          key: "column1",
          name: "Ay",
          fieldName: "ay",
          minWidth: 30,
          maxWidth: 30,
          isResizable: false,
        },
        {
          key: "column2",
          name: "Yıl",
          fieldName: "yil",
          minWidth: 50,
          maxWidth: 50,
          isResizable: false,

        },
        {
          key: "column3",
          name: "Masraf Merkezi Tanımı",
          fieldName: "control",
          minWidth: 250,
          maxWidth: 300,
          isResizable: false,
        },
        {
          key: "column4",
          name: "Bütçe kodu",
          fieldName: "butcekodu",
          minWidth: 150,
          maxWidth: 150,
          isResizable: false,

        },
        {
          key: "column5",
          name: "Bütçe tutarı",
          fieldName: "tutar",
          minWidth: 100,
          maxWidth: 100,
          isResizable: false,
        },

      ],
    };
    this.handler = this.handler.bind(this);
    this.Buttonclick = this.Buttonclick.bind(this);
    this.Buttonclick2 = this.Buttonclick2.bind(this);
  }
  handler() {
    this.setState({
      callchildcomponent: false,
    });
  }
  private Buttonclick(
    e: React.MouseEvent<
      | HTMLDivElement
      | HTMLAnchorElement
      | HTMLButtonElement
      | BaseButton
      | DefaultButton
      | HTMLSpanElement,
      MouseEvent
    >
  ) {
    e.preventDefault();
    this.setState({ callchildcomponent: true });
  }
  private Buttonclick2(
    e: React.MouseEvent<
      | HTMLDivElement
      | HTMLAnchorElement
      | HTMLButtonElement
      | BaseButton
      | DefaultButton
      | HTMLSpanElement,
      MouseEvent
    >
  ) {
    e.preventDefault();
    this.setState({ modaliac: true });
  }
  generateSif = () => {
    const prefix = "SAS";
    const randomNumber = Math.floor(100000 + Math.random() * 900000 - 123); // Rastgele 6 haneli sayı oluştur
    this.setState({ sifno: `${prefix}${randomNumber}` });
  };

  handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    this.setState({ secilendosya: file });

    if (file) {
      // Seçilen dosyanın adını state'e ekleyin
      this.setState({ selectedFileName: file.name });
    }
  };



  componentDidMount() {
    this.getTedarikciler();
    this.filtreleMasrafMerkezi();
    this.generateSif();

  }



  kontroltedarikcidegeri = () => {

    const is1 = (document.getElementById("indirimSonrasi") as HTMLInputElement).value;
    const is2 = (document.getElementById("indirimSonrasi2") as HTMLInputElement).value;
    const is3 = (document.getElementById("indirimSonrasi3") as HTMLInputElement).value;
    if (this.state.checkedValue == "option1") {
      if (this.state.rezerveedilen !== is1) {
        this.setState({ checkedValue: null });
      }
    }
    else if (this.state.checkedValue == "option2") {
      if (this.state.rezerveedilen !== is2) {
        this.setState({ checkedValue: null });
      }
    }
    else if (this.state.checkedValue == "option3") {
      if (this.state.rezerveedilen !== is3) {
        this.setState({ checkedValue: null });
      }
    }
    else { return; }
  };


  //TEKLİFLER TABLOSU TÜM OPERASYONLAR
  //----------------------------------------------------------------------------------------------------

  //Açıklama inputu değiştirme
  //----------------------------------------------------------------------------------------------------

  private handleAciklamaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = e.target.value;
    this.setState({ aciklama: inputValue });
  };


  //Tedarikçi seçimi operasyonları
  //----------------------------------------------------------------------------------------------------

  handleSelectedComboBoxValueChange = (value: string) => {
    this.setState({ tedarikci1: value }, () => {
      console.log("tedarikçi 1 state: " + this.state.tedarikci1);
    });

    if (this.state.secilentedarikci !== "" && value !== this.state.secilentedarikci) {
      alert("Tedarikçi değerini değiştirdiğiniz için seçiminiz sıfırlandı.Kontrol edip tekrar seçiniz")

      this.setState({ checkedValue: null });
      return;
    }
  };

  handleSelectedComboBoxValueChange2 = (value: string) => {
    this.setState({ tedarikci2: value }, () => {
      console.log("tedarikçi 2 state: " + this.state.tedarikci2);
    });

    if (this.state.secilentedarikci !== "" && value !== this.state.secilentedarikci) {
      alert("Tedarikçi değerini değiştirdiğiniz için seçiminiz sıfırlandı.Kontrol edip tekrar seçiniz")

      this.setState({ checkedValue: null });
      return;
    }
  };

  handleSelectedComboBoxValueChange3 = (value: string) => {
    this.setState({ tedarikci3: value }, () => {
      console.log("tedarikçi 3 state: " + this.state.tedarikci3);
    });

    if (this.state.secilentedarikci !== "" && value !== this.state.secilentedarikci) {
      alert("Tedarikçi değerini değiştirdiğiniz için seçiminiz sıfırlandı.Kontrol edip tekrar seçiniz")

      this.setState({ checkedValue: null });
      return;
    }
  };

  handleSelectedMasrafMerkeziChange = (value: string) => {
    this.filtreleButce();
    this.setState({ filteredmm: value }, () => {
      console.log("filtrelenen masraf merkezi : " + this.state.filteredmm);
    });


  };
  handleSelectedButceKoduChange = (value: string) => {
    this.setState({ filteredbk: value }, () => {
      console.log("filtrelenen bütçe kodu : " + this.state.filteredbk);
    });

  };
  HandeleKurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    this.setState({ kur: inputValue }, () => {
      console.log("kur: " + this.state.kur);
    });

  };
  handleParabirimiChange = (e: { target: { value: any; }; }) => {
    const selectedParabirimi = e.target.value;
    if (selectedParabirimi !== this.state.parabirimi) {

      this.setState({ checkedValue: null });
    }

    this.setState({
      parabirimi: selectedParabirimi,
      kur: selectedParabirimi === 'TL' ? '1' : this.state.kur, // TL seçiliyorsa, kur değerini sıfırla
    });
  };
  handleChange = (key: string) => {

    const a = this.state.tedarikci1;
    const b = this.state.tedarikci2;
    const c = this.state.tedarikci3;
    const vade = this.state.tedtumlist
    const foundItem = vade.find((item: { text1: string; }) => item.text1 === a);
    const foundItem2 = vade.find((item: { text1: string; }) => item.text1 === b);
    const foundItem3 = vade.find((item: { text1: string; }) => item.text1 === c);
    const is1 = (document.getElementById("indirimSonrasi") as HTMLInputElement)[
      "value"
    ];
    const is2 = (document.getElementById("indirimSonrasi2") as HTMLInputElement)[
      "value"
    ];
    const is3 = (document.getElementById("indirimSonrasi3") as HTMLInputElement)[
      "value"
    ];


    const mevcutbutce =
      parseFloat(
        this.state.selectedTutar.replace(/\./g, "").replace(",", ".")
      ) || 0;
    const kur = parseFloat(this.state.kur.replace(/\./g, "").replace(",", "."));
    const cikandeger = parseFloat(is1.replace(/\./g, "").replace(",", "."));
    const cikandeger2 = parseFloat(is2.replace(/\./g, "").replace(",", "."));
    const cikandeger3 = parseFloat(is3.replace(/\./g, "").replace(",", "."));

    const rezervbutce = (mevcutbutce - cikandeger).toLocaleString("tr-TR");
    const rezervbutce2 = (mevcutbutce - cikandeger2).toLocaleString("tr-TR");
    const rezervbutce3 = (mevcutbutce - cikandeger3).toLocaleString("tr-TR");

    this.setState({ checkedValue: key });

    switch (key) {
      case "option1":
        if (a === "") {
          alert("Lütfen tedarikçi adını yazıp tekrar seçiniz");
          this.setState({ checkedValue: null });
          return;

        }
        else if (is1 === "") {
          alert("Lütfen malzeme bilgilerini doldurup tekrar seçiniz");
          this.setState({ checkedValue: null });
          return;

        }
        else {
          alert(
            "Tedarikçi 1: " +
            a +
            " seçildi Maksimum harcama tutarınız " +
            this.state.selectedTutar +
            "TL"
          );

          this.setState({ sonToplam: (kur * cikandeger).toLocaleString("tr-TR") });
          this.setState({ onaybutcesi: rezervbutce });
          this.setState({ rezerveedilen: is1 });
          this.setState({ secilentedarikci: a });
          this.setState({ aciklama: "Seçilen Tedarikçi " + a + " çünkü" });
          this.setState({ vade: foundItem.text3 + " gün" });

        }
        break;

      case "option2":
        if (b === "") {
          alert("Lütfen tedarikçi adını yazıp tekrar seçiniz");
          this.setState({ checkedValue: null });
          return;
        }
        else if (is2 === "") {
          alert("Lütfen malzeme bilgilerini doldurup tekrar seçiniz");
          this.setState({ checkedValue: null });
          return;

        } else {
          alert(
            "Tedarikçi 2: " +
            b +
            " seçildi Maksimum harcama tutarınız " +
            this.state.selectedTutar +
            "TL"
          );

          this.setState({ sonToplam: (kur * cikandeger).toLocaleString("tr-TR") });
          this.setState({ onaybutcesi: rezervbutce2 });
          this.setState({ rezerveedilen: is2 });
          this.setState({ secilentedarikci: b });
          this.setState({ aciklama: "Seçilen Tedarikçi " + b + " çünkü" });
          this.setState({ vade: foundItem2.text3 + " gün" });

          break;
        }

      case "option3":
        if (c === "") {
          alert("Lütfen tedarikçi adını yazıp tekrar seçiniz");
          this.setState({ checkedValue: null });
          return;
        }
        else if (is3 === "") {
          alert("Lütfen malzeme bilgilerini doldurup tekrar seçiniz");
          this.setState({ checkedValue: null });
          return;

        } else {
          alert(
            "Tedarikçi 3: " +
            c +
            " seçildi Maksimum harcama tutarınız " +
            this.state.selectedTutar +
            "TL"
          );
          this.setState({ sonToplam: (kur * cikandeger).toLocaleString("tr-TR") });
          this.setState({ onaybutcesi: rezervbutce3 });
          this.setState({ rezerveedilen: is3 });
          this.setState({ secilentedarikci: c });
          this.setState({ aciklama: "Seçilen Tedarikçi " + c + " çünkü" });
          this.setState({ vade: foundItem3.text3 + " gün" });

          break;
        }

      default:
        break;
    }

  };
  tedarikciChange = (selectedOption: any) => {
    this.setState({ selectedOption });
  };

  //----------------------------------------------------------------------------------------------------
  //GÖNDER butonundaki sınırlamalar

  private handleSubmit = () => {
    const a = (document.getElementById("indirimSonrasi") as HTMLInputElement)[
      "value"
    ];
    const b = (document.getElementById("indirimSonrasi2") as HTMLInputElement)[
      "value"
    ];
    const c = (document.getElementById("indirimSonrasi3") as HTMLInputElement)[
      "value"
    ];
    const d = (document.getElementById("tarihVade") as HTMLInputElement)[
      "value"
    ];

    const f = (document.getElementById("teslimtarih") as HTMLInputElement)[
      "value"
    ];

    const mevcutbutce =
      parseFloat(
        this.state.selectedTutar.replace(/\./g, "").replace(",", ".")
      ) || 0;
    const cikandeger = parseFloat(a.replace(/\./g, "").replace(",", "."));
    const cikandeger2 = parseFloat(b.replace(/\./g, "").replace(",", "."));
    const cikandeger3 = parseFloat(c.replace(/\./g, "").replace(",", "."));

    if (this.state.secilenTutar === "") {
      alert("Lütfen masraf merkezini seçip onaylayınız");
    } else if (this.state.checkedValue === null) {
      alert("Lütfen tedarikçi seçiniz");
    } else if (d === "") {
      alert("Lütfen Vade belirtiniz");
    } else if (f === "") {
      alert("Lütfen tahmini bir teslim tarihi seçiniz");
    } else {
      if ( 
        this.state.checkedValue === "option1" && mevcutbutce < cikandeger ||
        this.state.checkedValue === "option2" && mevcutbutce < cikandeger2 ||
        this.state.checkedValue === "option3" && mevcutbutce < cikandeger3
      ) {
        alert(
          "Girdiğiniz bütçe tutarı ilgili bütçe kaleminde tutarından fazla olduğu için işlem yapılamaz.Bütçe transferi ya da ek bütçe onayı için lütfen bütçe departmanına gidiniz."
        );
        return;
      }

      this.createItem();
      alert(
        "Formunuz başarıyla gönderildi. Sayfa 5 saniye içinde yenilenecek..."
      );

      // 5 saniye (5000 milisaniye) bekle
      setTimeout(function () {
        // Sayfayı yenile
        window.location.reload();
      }, 5000);
    }
  };

  //----------------------------------------------------------------------------------------------------
  //İNDİRİM İŞLEMLERİ
  private handleIndirimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue !== this.state.indirim) {

      this.setState({ checkedValue: null });
    }
    this.setState({ indirim: inputValue });




  };
  private handleIndirim2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue !== this.state.indirim2) {

      this.setState({ checkedValue: null });
    }
    this.setState({ indirim2: inputValue });

  };
  private handleIndirim3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue !== this.state.indirim3) {

      this.setState({ checkedValue: null });
    }
    this.setState({ indirim3: inputValue });
  };


  //----------------------------------------------------------------------------------------------------
  // Hesaplamalar

  private handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    id: number,
    field: string,
    callback?: () => void
  ) => {

    let inputValue = e.target.value;

    // Trim leading and trailing spaces, but not for "alinacakmalzeme" field
    if (field !== "alinacakMalzeme") {
      inputValue = inputValue.trim();
    }

    // Update the state if the input is valid
    this.setState(
      (prevState: any) => {
        const updatedRows = prevState.rows.map((row: IRow) => {
          if (row.id === id) {
            const updatedRow = this.updateRowField(row, field, inputValue);
            this.calculateTotals(updatedRow);
            return updatedRow;
          } else {
            return row;
          }
        });

        // Set the state with the updated rows
        return { rows: updatedRows };
      },
      () => {
        this.kontroltedarikcidegeri();
        if (callback) {
          callback();
        }
      }
    );

  };

  private updateRowField = (row: IRow, field: string, value: string) => {
    // Update the specified field in the row
    return {
      ...row,
      [field]: value,
    };
  };

  private calculateTotals = (row: IRow) => {
    // Calculate totals based on the input values
    const adet = parseFloat(row.adet.replace(",", ".")) || 0;
    const birimFiyat = parseFloat(row.birim.replace(",", ".")) || 0;
    const total = adet * birimFiyat;

    const birimFiyat2 = parseFloat(row.birim2.replace(",", ".")) || 0;
    const total2 = adet * birimFiyat2;

    const birimFiyat3 = parseFloat(row.birim3.replace(",", ".")) || 0;
    const total3 = adet * birimFiyat3;

    row.total = total.toLocaleString("tr-TR");
    row.total2 = total2.toLocaleString("tr-TR");
    row.total3 = total3.toLocaleString("tr-TR");

    return row;
  };


  //----------------------------------------------------------------------------------------------------
  //Satır Ekle

  private addRow = () => {
    const newRow: IRow = {
      id: this.state.rows.length + 1,
      alinacakMalzeme: "",
      adet: "",
      birim: "",
      total: "",
      birim2: "",
      total2: "",
      birim3: "",
      total3: "",
    };

    this.setState((prevState: any) => ({
      rows: [...prevState.rows, newRow],
    }));
  };

  //----------------------------------------------------------------------------------------------------
  //Satır Sil

  private deleteRow = () => {
    const lastRowId = this.state.rows[this.state.rows.length - 1].id;

    // En son eklenen satırı sil
    const updatedRows = this.state.rows.filter(
      (row: IRow) => row.id !== lastRowId
    );

    // State'i güncelle
    this.setState({ rows: updatedRows });
  };



  //----------------------------------------------------------------------------------------------------
  // itemi SP Listte oluştur

  private createItem = (): void => {
    this.setState({ isVisible: false });


    const body: string = JSON.stringify({
      Tedarikci1: this.state.tedarikci1,
      Tedarikci2: this.state.tedarikci2,
      Tedarikci3: this.state.tedarikci3,
      AlinacakMalzeme: this.state.rows.map((row: IRow) => row.id.toString() + ".girdi " + row.alinacakMalzeme.toString()).join(",\n"),
      Adet: this.state.rows.map((row: IRow) => row.id.toString() + ".girdi " + row.adet.toString()).join(",\n"),
      Birim: this.state.rows.map((row: IRow) => row.id.toString() + ".girdi " + row.birim.toString()).join(",\n"),
      Total: this.state.rows.map((row: IRow) => row.id.toString() + ".girdi " + row.total.toString()).join(",\n"),
      Birim2: this.state.rows.map((row: IRow) => row.id.toString() + ".girdi " + row.birim2.toString()).join(",\n"),
      Total2: this.state.rows.map((row: IRow) => row.id.toString() + ".girdi " + row.total2.toString()).join(",\n"),
      Birim3: this.state.rows.map((row: IRow) => row.id.toString() + ".girdi " + row.birim3.toString()).join(",\n"),
      Total3: this.state.rows.map((row: IRow) => row.id.toString() + ".girdi " + row.total3.toString()).join(",\n"),

      IndirimOncesi: (
        document.getElementById("indirimOncesi") as HTMLInputElement
      )["value"],

      Indirim: (document.getElementById("indirim") as HTMLInputElement)[
        "value"
      ],
      IndirimSonrasi: (
        document.getElementById("indirimSonrasi") as HTMLInputElement
      )["value"],

      IndirimOncesi2: (
        document.getElementById("indirimOncesi2") as HTMLInputElement
      )["value"],
      Indirim2: (document.getElementById("indirim2") as HTMLInputElement)[
        "value"
      ],
      IndirimSonrasi2: (
        document.getElementById("indirimSonrasi2") as HTMLInputElement
      )["value"],

      IndirimOncesi3: (
        document.getElementById("indirimOncesi3") as HTMLInputElement
      )["value"],
      Indirim3: (document.getElementById("indirim3") as HTMLInputElement)[
        "value"
      ],
      IndirimSonrasi3: (
        document.getElementById("indirimSonrasi3") as HTMLInputElement
      )["value"],

      tahminiteslim: (document.getElementById("teslimtarih") as HTMLInputElement)[
        "value"
      ],
      TarihVade: this.state.vade,

      SonToplam: (document.getElementById("sonToplam") as HTMLInputElement)[
        "value"
      ],

      rezerveedilenbutce: this.state.rezerveedilen,
      onaybutcesi: this.state.onaybutcesi,
      SIFno: this.state.sifno,
      secilentedarikci: this.state.secilentedarikci,


      secilenmmID: this.state.selectedId,
      secilenmmAy: this.state.selectedAy,
      secilenmmYil: this.state.selectedYil,
      secilenmmAltKod: this.state.selectedAltkod,
      secilenmmUstKod: this.state.selectedUstkod,
      secilenmmKontrol: this.state.selectedControl,
      secilenmmButceTutar: this.state.selectedTutar,
      secilenmmButceKod: this.state.selectedButceKodu,
      secilenmmTanim: this.state.selectedDescription,

    });
    this.props.context.spHttpClient
      .post(
        `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('SatinAlmaFormuKayitlari')/items`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
          },
          body: body,
        }
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          response.json().then((responseJSON) => {
            const newItemId: number = responseJSON.Id;

            // Yeni oluşturulan öğeye ek dosya ekleyin
            this.addAttachment(newItemId);



          });
        } else {
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  //----------------------------------------------------------------------------------------------------
  //PDF'i kaydet ve attachment olarak gönder

  exportPDF = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const input = document.getElementById("icerik");

      if (!input) {
        console.error('Element with id "Saf" not found');
        reject("Element not found");
        return;
      }

      const textareas = input.querySelectorAll("textarea");

      // Textareaları dönerek içeriği <p> elementine dönüştür 
      textareas.forEach(textarea => {
        if (textarea.id === 'aciklama' && textarea.parentNode) {
          const pElement = document.createElement("p");
          pElement.textContent = textarea.value;

          // Yaratılan <p> elementine bir class ekleyin
          pElement.classList.add(styles.big) ;

          textarea.parentNode.replaceChild(pElement, textarea);
        };
        if (textarea.id === 'alinacakMalzeme' && textarea.parentNode) {
          const pElement = document.createElement("p");
          pElement.textContent = textarea.value; 

          // Yaratılan <p> elementine bir class ekleyin
          pElement.classList.add(styles.small) ; 

          textarea.parentNode.replaceChild(pElement, textarea);  
        }
      });


      html2canvas(input, { logging: true, useCORS: true, scale: 2 }).then(
        (canvas) => {
          const imgWidth = 841;
          const imgHeight = 1189;

          const pdf = new jsPDF("p", "mm", "a0");
          pdf.addImage(
            canvas.toDataURL("image/jpeg"),
            "JPEG",
            0,
            0,
            imgWidth,
            imgHeight
          );

          const pdfBlob = pdf.output("blob");
          resolve(pdfBlob);
          const pdfFileName = "Saif.pdf";
          pdf.save(pdfFileName);
        }
      );
    });
  };

  addAttachment = async (itemId: number): Promise<void> => {
    try {
      const pdfBlob = await this.exportPDF();
      const fileName = "satinalmaformu.pdf";
      const response = await this.props.context.spHttpClient.post(
        `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('SatinAlmaFormuKayitlari')/items(${itemId})/AttachmentFiles/add(FileName='${fileName}')`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
          },
          body: pdfBlob,
        }
      );


      if (response.ok) {
        const file = this.state.secilendosya;
        const fileName = this.state.selectedFileName;
        const response = await this.props.context.spHttpClient.post(
          `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('SatinAlmaFormuKayitlari')/items(${itemId})/AttachmentFiles/add(FileName='${fileName}')`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              Accept: "application/json;odata=nometadata",
              "Content-type": "application/json;odata=nometadata",
              "odata-version": "",
            },
            body: file,
          }
        );
        if (response.ok) {
          console.log("Başarılı");
        }
      } else {
        console.error("Ek eklenirken hata oluştu");
      }
    } catch (error) {
      console.error(error);
    }
  };


  //----------------------------------------------------------------------------------------------------
  //Masraf Merkezi tüm operasyonlar


  filtreleMasrafMerkezi = async (): Promise<void> => {
    try {
      const response = await axios.get('https://satinalmaformu.com/masraffiltre');



      if (response.status === 200) {
        const responseJSON = response.data;

        const filtered = responseJSON.map((item: any, index: number) => ({
          key: index,
          text: item.Mm_Control,
        }));

        this.setState({ secilimasrafmerkeziList: filtered });

      } else {
        console.error(response.data);
        alert(`Bir terslik var.`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  filtreleButce = async (): Promise<void> => {
    try {
      const response = await axios.get('https://satinalmaformu.com/masrafbutce');

      if (response.status === 200) {
        const responseJSON = response.data;

        // Sadece "Mağazacılık" için olan öğeleri filtrele
        const filtered = responseJSON
          .filter((item: any) => item.Mm_Control === this.state.filteredmm)
          .map((item: any, index: number) => ({
            key: index,
            text: item.Butce_Kodu
          }));

        this.setState({ secilibutcekoduList: filtered });
      } else {
        console.error(response.data);
        alert(`Bir terslik var.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  getMasrafMerkezi = async (): Promise<void> => {
    try {
      const response = await axios.get('https://satinalmaformu.com/masrafmerkezi');

      if (response.status === 200) {
        const responseJSON = response.data;

        const updatedList = responseJSON.map((item: any) => ({
          id: item.İd,
          ay: item.Ay,
          yil: item.Yil,
          altkod: item.Mm_Alt_Kod,
          ustkod: item.Mm_Ust_Kod,
          description: item.Mm_Description,
          control: item.Mm_Control,
          tutar: item.Tutar,
          butcekodu: item.Butce_Kodu,
        }));
        const currentDate = new Date();

        const currentMonth = currentDate.getMonth() + 1;

        // Filtreleme işlemi
        const filteredList = updatedList.filter((item: { control: any; butcekodu: any; ay: any }) => {

          return (
            item.control === this.state.filteredmm &&
            item.butcekodu === this.state.filteredbk &&
            item.ay === currentMonth.toString()
          );
        });
        const filteredList2 = updatedList.filter((item: { control: any; butcekodu: any }) => {

          return (
            item.control === this.state.filteredmm &&
            item.butcekodu === this.state.filteredbk
          );
        });


        this.setState({ tummasrafMerkeziList: filteredList2 });
        this.setState({ masrafMerkeziList: filteredList });
      } else {
        console.error(response.data);
        alert(`Bir terslik var.`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  getTedarikciler = async (): Promise<void> => {
    const retryCount = 3; // Tekrar deneme sayısı
    let currentRetry = 0;

    while (currentRetry < retryCount) {
      try {
        const response = await axios.get('https://satinalmaformu.com/tedarikciler');

        if (response.status === 200) {
          const responseJSON = response.data;

          const titleList = responseJSON.map((ted: any, index: number) => ({
            key: index,
            text: ted.Tedarikci, 
          }));
          const tumliste = responseJSON.map((all: any, index: number) => ({
            key: index,
            text1: all.Tedarikci,
            text2: all.Tedarikcikod,
            text3: all.vade,
          }));

          this.setState({ tedtumlist: tumliste, tedarikcilistesi: titleList });
          break; // Başarıyla tamamlandı, döngüyü kır 
        } else {
          console.error(response.data);
          
        }
      } catch (error) {
        console.error(error);
      }

      currentRetry++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 saniye bekleyerek tekrar deneme
    }

    if (currentRetry === retryCount) { 
      // Tekrar deneme sayısını aştıysa, kullanıcıya bilgi verebilirsiniz
      console.error('Tedarikçileri alırken hata oluştu ve tekrar deneme sınırına ulaşıldı.');
      
    }
  };

  //----------------------------------------------------------------------------------------------------



  public render(): React.ReactElement<ISafProps> {

    const items: IDetailsListCompactExampleItem[] =
      this.state.masrafMerkeziList;




    const handleDetailsListCompactExampleStateChange = (state: any) => {
      const {
        selectedId,
        selectedYil,
        selectedAy,
        selectedButceKodu,
        selectedTutar,
        selectedAltkod,
        selectedUstkod,
        selectedDescription,
        selectedControl,
      } = state;

      // Değerlerin doluluk durumuna göre state güncelleme
      this.setState(
        (prevState: {
          selectedId: number;
          selectedYil: string;
          selectedAy: string;
          selectedButceKodu: string;
          selectedTutar: string;
          selectedAltkod: string;
          selectedUstkod: string;
          selectedDescription: string;
          selectedControl: string;
        }) => ({
          selectedId: selectedId !== "" ? selectedId : prevState.selectedId,
          selectedYil: selectedYil !== "" ? selectedYil : prevState.selectedYil,
          selectedAy:
            selectedAy !== ""
              ? selectedAy
              : prevState.selectedAy,
          selectedButceKodu:
            selectedButceKodu !== ""
              ? selectedButceKodu
              : prevState.selectedButceKodu,
          selectedTutar:
            selectedTutar !== ""
              ? selectedTutar
              : prevState.selectedTutar,
          selectedAltkod:
            selectedAltkod !== ""
              ? selectedAltkod
              : prevState.selectedAltkod,
          selectedUstkod: selectedUstkod !== "" ? selectedUstkod : prevState.selectedUstkod,
          selectedDescription: selectedDescription !== "" ? selectedDescription : prevState.selectedDescription,
          selectedControl: selectedControl !== "" ? selectedControl : prevState.selectedControl,
        })
      );
    };

    const evaluateExpression = (expression: string) => {
      try {
        // İfadeyi düzelt: Önce noktaları virgüle, sonra virgülleri noktaya çevir
        const fixedExpression = expression
          .replace(/\./g, "")
          .replace(/,/g, ".");

        // Hesaplamayı gerçekleştir
        const result = eval(fixedExpression);

        // Sonucu Türkçe formatında stringe çevir
        const formattedResult = result.toLocaleString("tr-TR");

        return formattedResult;
      } catch (error) {
        return "";
      }
    };

    const totalExpression = this.state.rows
      .map((row: IRow) => row.total.toString())
      .join(" + ");
    const totalResult = evaluateExpression(totalExpression);

    const total2Expression = this.state.rows
      .map((row: IRow) => row.total2.toString())
      .join(" + ");
    const total2Result = evaluateExpression(total2Expression);

    const total3Expression = this.state.rows
      .map((row: IRow) => row.total3.toString())
      .join(" + ");
    const total3Result = evaluateExpression(total3Expression);


    const indirimSonrasiExpresion =
      totalResult + " - " + this.state.indirim.toString().replace(".", ",");

    const indirimsonrasiresult =
      evaluateExpression(indirimSonrasiExpresion) || totalResult;

    const indirimSonrasi2Expresion =
      total2Result + " - " + this.state.indirim2.toString().replace(".", ",");

    const indirimsonrasi2result =
      evaluateExpression(indirimSonrasi2Expresion) || total2Result;


    const indirimSonrasi3Expresion =
      total3Result + " - " + this.state.indirim3.toString().replace(".", ",");


    const indirimsonrasi3result =
      evaluateExpression(indirimSonrasi3Expresion) || total3Result;


    return (
      <div>
        <DefaultButton
          onClick={(e) => this.Buttonclick(e)}
          text="Satın Alma Formu İçin Tıklayınız"
          className={styles.customGirisButton}
        />

        {this.state.callchildcomponent && (
          <MYModal handler={() => this.setState({ callchildcomponent: false })}>
            <div className={styles.custom} id="Saf">
              <div className={styles.container} id="icerik">
                <h2 id="sifno"   >SIF No : {this.state.sifno}</h2>

                <div className={styles.row}>
                  <div className={styles.column}>
                    <table className={styles.table} id="Giriş">
                      <thead>
                        <tr>
                          <th colSpan={20} className={styles.th}>
                            PANÇO GİYİM SANAYİ VE TİCARET A.Ş <br />
                            SATIN ALMA FORMU
                          </th>
                        </tr>

                      </thead>
                    </table>
                    <table className={styles.table} id='Masraf'>
                      <thead>
                        <tr >
                          <th className={styles.th2} colSpan={4}>Masraf Merkezi Seçimi </th>
                        </tr >
                        <br />
                      </thead>
                      <tbody>
                        {this.state.isVisible && (
                          <tr>
                            <td colSpan={1}>

                              <div className={styles.fieldLabel}>
                                Masraf Merkezi Tanımı Seçin :
                              </div>

                              <ComboBoxVirtualizedExample2
                                deger={this.state.secilimasrafmerkeziList}
                                onSelectedValueChange={
                                  this.handleSelectedMasrafMerkeziChange
                                }
                              />
                            </td>


                            <td colSpan={1}>
                              <div className={styles.fieldLabel}>
                                Bütçe Tanımı Seçin :
                              </div>
                              <ComboBoxVirtualizedExample2
                                deger={this.state.secilibutcekoduList}
                                onSelectedValueChange={
                                  this.handleSelectedButceKoduChange
                                }
                              />
                            </td>
                            <td colSpan={1} >
                              <button
                                className={styles.customSubmitButton}
                                onClick={this.getMasrafMerkezi}

                              >
                                Listele
                              </button>
                            </td>
                            <td colSpan={1} >
                              <button
                                className={styles.customSubmitButton}
                                onClick={(e) => this.Buttonclick2(e)}
                              >
                                Yıllık Bütçeyi Görüntüle
                              </button>
                              {this.state.modaliac && (
                                <MYModal handler={() => this.setState({ modaliac: false })}>
                                  <div className={styles.container2} >
                                    <h2 className={styles.th3} >İlgili Masraf Merkezine ait Aylık Bütçe Rakamları</h2>

                                    <div style={{ overflowY: 'hidden', maxHeight: '1100px' }}>

                                      <DetailsList columns={this.state.col} items={this.state.tummasrafMerkeziList} selectionMode={SelectionMode.none} />

                                    </div>

                                  </div>
                                </MYModal>
                              )}
                            </td>



                          </tr>
                        )}
                        {!this.state.isVisible && null}

                        <tr >
                          <td colSpan={4}>
                            <DetailsListCompactExample
                              items={items}
                              onStateChange={handleDetailsListCompactExampleStateChange}
                            />
                          </td>

                        </tr>

                      </tbody>

                    </table>

                    <table className={styles.table} id="Tedarikçi">
                      <thead>
                        <tr>
                          <th className={styles.th2} colSpan={10}>Tedarikçilerden Alınan Teklifler </th>
                        </tr>

                        <tr>
                          <th colSpan={2}>
                            <label>Para Birimi :</label>
                            <select
                              id="parabirimi"
                              className={styles.kurinput}
                              value={this.state.parabirimi}
                              onChange={this.handleParabirimiChange}
                            >
                              <option value="TL">TL(₺)</option>
                              <option value="USD">USD($)</option>
                              <option value="EUR">EUR(€)</option>
                              <option value="GBP">GBP(£)</option>
                            </select>
                          </th>
                          <th colSpan={2}>
                            <label>Kur Değeri :</label>
                            <input
                              type="text"
                              className={styles.kurinput}
                              id="kur"
                              value={this.state.kur}
                              onChange={this.HandeleKurChange}
                              disabled={this.state.parabirimi === 'TL'} // TL seçiliyorsa input'u devre dışı bırak
                            />
                          </th>
                          <th colSpan={2}>
                            <input
                              type="checkbox"
                              value="option1"
                              checked={this.state.checkedValue === "option1"}
                              onChange={() => this.handleChange("option1")}
                            />
                            <label>Tedarikçi 1</label>
                          </th>
                          <th colSpan={2}>
                            <input
                              type="checkbox"
                              value="option2"
                              checked={this.state.checkedValue === "option2"}
                              onChange={() => this.handleChange("option2")}
                            />
                            <label>Tedarikçi 2</label>
                          </th>
                          <th colSpan={2}>
                            <input
                              type="checkbox"
                              value="option3"
                              checked={this.state.checkedValue === "option3"}
                              onChange={() => this.handleChange("option3")}
                            />
                            <label>Tedarikçi 3</label>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={4}>
                            <button
                              className={styles.customAddButton}
                              onClick={() => this.addRow()}
                            >
                              Satır Ekle
                            </button>

                            <button
                              className={styles.customDeleteButton}
                              onClick={() => this.deleteRow()}
                            >
                              Satır Sil
                            </button>
                          </td>

                          <td colSpan={2}>
                            <ComboBoxVirtualizedExample
                              deger={this.state.tedarikcilistesi}
                              onSelectedValueChange={
                                this.handleSelectedComboBoxValueChange
                              }
                            />
                          </td>
                          <td colSpan={2}>
                            <ComboBoxVirtualizedExample
                              deger={this.state.tedarikcilistesi}
                              onSelectedValueChange={
                                this.handleSelectedComboBoxValueChange2
                              }
                            />
                          </td>
                          <td colSpan={2}>
                            <ComboBoxVirtualizedExample
                              deger={this.state.tedarikcilistesi}
                              onSelectedValueChange={
                                this.handleSelectedComboBoxValueChange3
                              }
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.th4} colSpan={10}>***KDV Hariç Birim Fiyat değerler girilmelidir***</th>
                        </tr>
                        <tr>
                          <th colSpan={3}>Alınacak Malzeme</th>
                          <th colSpan={1}>Adet</th>
                          <th colSpan={1}>KDV Hariç Birim Fiyat</th>
                          <th colSpan={1}>Toplam Tutar</th>
                          <th colSpan={1}>KDV Hariç Birim Fiyat</th>
                          <th colSpan={1}>Toplam Tutar</th>
                          <th colSpan={1}>KDV Hariç Birim Fiyat</th>
                          <th colSpan={1}>Toplam Tutar</th>
                        </tr>
                        {this.state.rows.map((row: IRow) => (
                          <tr key={row.id} className={styles.tarow2}>
                            <td colSpan={3}>
                              <textarea
                                className={styles.inputam}
 
                                id="alinacakMalzeme"
                                placeholder="Malzeme Giriniz.."
                                value={row.alinacakMalzeme}
                                onChange={(e) =>
                                  this.handleInputChange(e, row.id, "alinacakMalzeme")
                                }
                                rows={10}
                                wrap="soft"
                              />
                            </td>
                            <td colSpan={1}>
                              <textarea
                                className={styles.input2}
                                id="adet"
                                value={row.adet}
                                onChange={(e) =>
                                  this.handleInputChange(e, row.id, "adet")
                                }
                              />
                            </td>
                            <td colSpan={1}>
                              <textarea

                                className={styles.input}
                                id="birim"
                                value={row.birim}
                                onChange={(e) =>
                                  this.handleInputChange(e, row.id, "birim")
                                }
                              />
                            </td>
                            <td colSpan={1}>
                              <textarea
                                className={styles.input}
                                id="total"
                                readOnly
                                value={row.total}
                                onChange={(e) =>
                                  this.handleInputChange(e, row.id, "total")
                                }
                              />
                            </td>
                            <td colSpan={1}>
                              <textarea
                                className={styles.input}
                                id="birim2"
                                value={row.birim2}
                                onChange={(e) =>
                                  this.handleInputChange(e, row.id, "birim2")
                                }
                              />
                            </td>
                            <td colSpan={1}>
                              <textarea
                                className={styles.input}
                                id="total2"
                                readOnly
                                value={row.total2}
                                onChange={(e) =>
                                  this.handleInputChange(e, row.id, "total2")
                                }
                              />
                            </td>
                            <td colSpan={1}>
                              <textarea
                                className={styles.input}
                                id="birim3"
                                value={row.birim3}
                                onChange={(e) =>
                                  this.handleInputChange(e, row.id, "birim3")
                                }
                              />
                            </td>
                            <td colSpan={1}>
                              <textarea
                                className={styles.input}
                                id="total3"
                                readOnly
                                value={row.total3}
                                onChange={(e) =>
                                  this.handleInputChange(e, row.id, "total3")
                                }
                              />
                            </td>
                          </tr>
                        ))}
                        <tr className={styles.tarow}>
                          <th colSpan={4}>İndirim öncesi Toplam</th>
                          <td colSpan={2}>
                            <input
                              className={styles.input}
                              type="text"
                              id="indirimOncesi"
                              readOnly
                              value={totalResult}
                            />
                          </td>
                          <td colSpan={2}>
                            <input
                              className={styles.input}
                              type="text"
                              id="indirimOncesi2"
                              readOnly
                              value={total2Result}
                            />
                          </td>
                          <td colSpan={2}>
                            <input
                              className={styles.input}
                              type="text"
                              id="indirimOncesi3"
                              readOnly
                              value={total3Result}
                            />
                          </td>
                        </tr>
                        <tr className={styles.tarow}>
                          <th colSpan={4}>Uygulanan İndirim</th>
                          <td colSpan={2}>
                            <input
                              className={styles.input}
                              type="text"
                              id="indirim"
                              value={this.state.indirim}
                              onChange={this.handleIndirimChange}
                            />
                          </td>
                          <td colSpan={2}>
                            <input
                              className={styles.input}
                              type="text"
                              id="indirim2"
                              value={this.state.indirim2}
                              onChange={this.handleIndirim2Change}
                            />
                          </td>
                          <td colSpan={2}>
                            <input
                              className={styles.input}
                              type="text"
                              id="indirim3"
                              value={this.state.indirim3}
                              onChange={this.handleIndirim3Change}
                            />
                          </td>
                        </tr>
                        <tr className={styles.tarow}>
                          <th colSpan={4}>İndirim Sonrası Toplam</th>
                          <td colSpan={2}>
                            <input
                              className={styles.input}
                              type="text"
                              id="indirimSonrasi"
                              value={indirimsonrasiresult}
                              readOnly
                            ></input>
                          </td>
                          <td colSpan={2}>
                            <input
                              className={styles.input}
                              type="text"
                              id="indirimSonrasi2"
                              value={indirimsonrasi2result}
                              readOnly
                            ></input>
                          </td>
                          <td colSpan={2}>
                            <input
                              className={styles.input}
                              type="text"
                              id="indirimSonrasi3"
                              value={indirimsonrasi3result} 

                              readOnly
                            ></input>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table className={styles.table} id="açıklama">
                      <thead>
                        <tr>
                          <th className={styles.th2} colSpan={20}>Tedarikçinin Seçilme Nedeni</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={20}>
                            <textarea
                              required
                              className={styles.input3}
                              id="aciklama"
                              value={this.state.aciklama}
                              onChange={this.handleAciklamaChange}
                            />
                          </td>
                        </tr>

                      </tbody>
                    </table>

                    <table className={styles.table} id="Payment">
                      <thead>
                        <tr>
                          <th className={styles.th2} colSpan={20}>Ödeme Şekli</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={7}>
                            <div className={styles.fieldLabel}>
                              Tahmini Teslim Tarihi:
                            </div>
                            <input
                              type="date"
                              id="teslimtarih"
                              className={styles.input}
                            />
                          </td>
                          <td colSpan={6}>
                            <div className={styles.fieldLabel}>Tarih veya Vade:</div>
                            <input
                              required
                              className={styles.input}
                              type="text"
                              id="tarihVade"
                              value={this.state.vade}
                            />
                          </td>
                          <td colSpan={6}>
                            <div className={styles.fieldLabel}>Toplam :</div>
                            <input
                              required
                              className={styles.input}
                              type="text"
                              id="sonToplam"
                              value={this.state.sonToplam}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>



                  </div>
                </div>

              </div>
              <table className={styles.table}>
                <tbody>

                  <td>
                    <input
                      type="file"
                      onChange={this.handleFileUpload}
                      style={{ display: "none" }}
                      ref={(input) => (this.fileInput = input)}
                    />
                    <button
                      className={styles.customAddButton}
                      onClick={() => this.fileInput.click()}
                    >
                      Excel dosyası ekle
                    </button>

                    {this.state.selectedFileName && (
                      <div>
                        Seçilen Dosya: {this.state.selectedFileName}
                      </div>
                    )}
                  </td>


                </tbody>
              </table>

              <table className={styles.table}>
                <tbody>
                  <tr>
                    <td>
                      <button
                        className={styles.customSubmitButton}
                        onClick={this.handleSubmit} 
                      >
                        Gönder
                      </button>

                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </MYModal>
        )}
      </div>

    );

  }

}


// AUTHOR : UFUK CAN KAHRAMAN
// 2024
// NOT : EĞER BUNU OKUYORSAN VE KODU DÜZELTMEN GEREKİYORSA  KUSURA BAKMA HAKLISIN KOD BİRAZ SPAGETTİ OLMUŞ AMA SEN YAPARSIN KOÇ!!!