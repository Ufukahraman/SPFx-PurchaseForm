import * as React from 'react';
import { IComboBoxStyles, VirtualizedComboBox, IComboBoxOption, IComboBox } from '@fluentui/react';


const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: '600px' } };

export interface ComboBoxVirtualizedExample2Props {
  deger: IComboBoxOption[];
  onSelectedValueChange: (selectedValue: string) => void; // Yeni ekledik
}

export const ComboBoxVirtualizedExample2: React.FunctionComponent<ComboBoxVirtualizedExample2Props> = ({ deger, onSelectedValueChange }) => {
  const handleChange = (
    event: React.FormEvent<IComboBox>, 
    option?: IComboBoxOption,
    index?: number,
    value?: string
  ) => {
    const selectedValue = value || ''; // Eğer value undefined ise, boş bir string olarak varsayalım

    onSelectedValueChange(selectedValue);
  };

  return (
    <VirtualizedComboBox
      options={deger}
      dropdownMaxWidth={600}
      dropdownWidth={600}
      styles={comboBoxStyles}
      onChange={handleChange}     
    />
  );
};
