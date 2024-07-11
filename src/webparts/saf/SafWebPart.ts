import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
 
} from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration ,PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'SafWebPartStrings';
import Saf from './components/Saf';
import { ISafProps } from './components/ISafProps';

export interface ISafWebPartProps {
  description: string;
}

export default class SafWebPart extends BaseClientSideWebPart<ISafWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISafProps> = React.createElement(
      Saf,
      {
        description: this.properties.description,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
