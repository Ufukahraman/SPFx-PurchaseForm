import * as React from "react";
import _ from "lodash";

import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { MarqueeSelection } from "@fluentui/react/lib/MarqueeSelection";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import styles from "./Saf.module.scss";

const exampleChildClass = mergeStyles({
  display: "block",
  marginBottom: "10px",
});



export interface IDetailsListCompactExampleItem {
  key: number;
  id: number;
  yil: string;
  ay: string;
  butcekodu: string;
  tutar: string;
  altkod: string;
  ustkod: string;
  description: string;
  control: string;
}

export interface IDetailsListCompactExampleProps {

  items: IDetailsListCompactExampleItem[];

  onStateChange: (state: IDetailsListCompactExampleState) => void; // Yeni prop ekleyin

}

export interface IDetailsListCompactExampleState {
  items: IDetailsListCompactExampleItem[];
  selectionDetails: string;
  isMasrafMerkeziVisible: boolean;
  selectedId: string,
  selectedYil: string,
  selectedAy: string,
  selectedButceKodu: string,
  selectedTutar: string,
  selectedAltkod: string,
  selectedUstkod: string,
  selectedDescription: string,
  selectedControl: string,

}


export class DetailsListCompactExample extends React.Component<
  IDetailsListCompactExampleProps,
  IDetailsListCompactExampleState
> {
  private _selection: Selection;
  private _columns: IColumn[];

  constructor(props: IDetailsListCompactExampleProps) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () =>
        this.setState({ selectionDetails: this._getSelectionDetails() }),
    });

    this._columns = [
      {
        key: "column1",
        name: "Ay",
        fieldName: "ay",
        minWidth: 30,
        maxWidth: 150,
        isResizable: false,
      },
      {
        key: "column2",
        name: "Yıl",
        fieldName: "yil",
        minWidth: 30,
        maxWidth: 150,
        isResizable: false,

      },
      {
        key: "column3",
        name: "Masraf Merkezi Tanımı",
        fieldName: "control", 
        minWidth: 60,
        maxWidth: 350,
        isResizable: false, 
      },
      {
        key: "column4",
        name: "Bütçe kodu",
        fieldName: "butcekodu",
        minWidth: 40,
        maxWidth: 250,
        isResizable: false,
      },
      {
        key: "column5",
        name: "Bütçe tutarı",
        fieldName: "tutar",
        minWidth: 40,
        maxWidth: 250,
        isResizable: false,
      },

    ];

    this.state = {
      items: props.items,
      selectionDetails: this._getSelectionDetails(),
      isMasrafMerkeziVisible: true,

      selectedId: "",
      selectedYil: "",
      selectedAy: "",
      selectedButceKodu: "",
      selectedTutar: "",
      selectedAltkod: "",
      selectedUstkod: "",
      selectedDescription: "",
      selectedControl: "",

    };

  }

  public componentDidUpdate(prevProps: IDetailsListCompactExampleProps): void {
    // Eğer dışarıdan gelen items prop'u değişirse, bileşenin durumunu güncelle

    if (!_.isEqual(prevProps.items, this.props.items)) {
      this.setState(
        {
          items: this.props.items,
        },
        () => this.props.onStateChange(this.state)
      );
    }
  }


  




  public render(): JSX.Element {
    const { items, selectionDetails, } = this.state;
    const isConfirmButtonDisabled = this._selection.getSelectedCount() !== 1;

    return (
      <div >
        <div className={styles.row}>
          <div className={styles.column}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td colSpan={10}>
                    <div className={exampleChildClass}>{selectionDetails}</div>
                  </td>
                  <td colSpan={2}>

                    <button
                      className={`${styles.customAddButton} ${isConfirmButtonDisabled ? styles.disabledButton : ""
                        }`}
                      onClick={this._onConfirmClick}
                      disabled={isConfirmButtonDisabled}
                    >
                      Onayla
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


        <div style={{ overflowY: 'hidden', maxHeight: '450px' }}>
          <MarqueeSelection selection={this._selection}>
            <DetailsList
              compact={true}
              items={items}
              columns={this._columns}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selection={this._selection}
              selectionMode={SelectionMode.single}
              selectionPreservedOnEmptyClick={false} 
              ariaLabelForSelectionColumn="Toggle selection"
              ariaLabelForSelectAllCheckbox="Toggle selection for all items"
              checkButtonAriaLabel="select row"
            />
          </MarqueeSelection>
        </div>

      </div>
    );
  }
  // _onConfirmClick metodunu güncelleyin
  public _onConfirmClick = (): void => {
    const selectedItems =
      this._selection.getSelection() as IDetailsListCompactExampleItem[];


    if (selectedItems.length === 1) {
      const selectedId = selectedItems[0].id;
      const selectedYil = selectedItems[0].yil;
      const selectedAy = selectedItems[0].ay;
      const selectedButceKodu = selectedItems[0].butcekodu;
      const selectedTutar = selectedItems[0].tutar;
      const selectedAltkod = selectedItems[0].altkod;
      const selectedUstkod = selectedItems[0].ustkod;
      const selectedDescription = selectedItems[0].description;
      const selectedControl = selectedItems[0].control;


      const selectedItem = selectedItems[0];

      // Seçilen öğeyi tekrar seçili hale getir
      this._selection.setAllSelected(false);
      this._selection.setItems([selectedItem], true /* shouldNotUpdateSelection */);

      this.setState(
        {
          items: [selectedItem],
          isMasrafMerkeziVisible: false,
          selectedId: selectedId.toString(),
          selectedYil: selectedYil,
          selectedAy: selectedAy,
          selectedButceKodu: selectedButceKodu,
          selectedTutar: selectedTutar,
          selectedAltkod: selectedAltkod,
          selectedUstkod: selectedUstkod,
          selectedDescription: selectedDescription,
          selectedControl: selectedControl,
          selectionDetails: `Maksimum Harcama Limitiniz: ${selectedTutar}, Eğer bu değerin üzerinde bir talepte bulunmak istiyorsanız lütfen Finans departmanından talepte bulununuz. `,
        },
        () => this.props.onStateChange(this.state)
      );
    } else {
      console.log("Hata: Bir öğe seçilmelidir.");
    }
  };


  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return "Lütfen Masraf merkezi seçiniz";
      case 1:
        return (
          "Maksimum Harcama Limitiniz: " +
          (this._selection.getSelection()[0] as IDetailsListCompactExampleItem)
            .tutar + ", Eğer bu değerin üzerinde bir talepte bulunmak istiyorsanız lütfen Finans departmanından talepte bulununuz. "
        );
      default:
        return `${selectionCount} öğe seçildi`;
    }
  }




}
