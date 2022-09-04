/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

// powerbi
import powerbiVisualsApi from "powerbi-visuals-api";
import mapValues from "lodash.mapValues";
import toArray from "lodash.toArray";

import DataView = powerbiVisualsApi.DataView;
import DataViewValueColumns = powerbiVisualsApi.DataViewValueColumns;
import DataViewCategoryColumn = powerbiVisualsApi.DataViewCategoryColumn;
import DataViewCategorical = powerbiVisualsApi.DataViewCategorical;
import PrimitiveValue = powerbiVisualsApi.PrimitiveValue;
import DataViewValueColumn = powerbiVisualsApi.DataViewValueColumn;
import DataViewCategoricalColumn = powerbiVisualsApi.DataViewCategoricalColumn;

export class WordCloudColumns<T> {
    public static GET_CATEGORICAL_VALUES(dataView: DataView): WordCloudColumns<DataViewCategoryColumn[]> {
        const categorical: DataViewCategorical = dataView && dataView.categorical,
            categories: DataViewCategoryColumn[] = categorical && categorical.categories || [],
            values: DataViewValueColumns = <DataViewValueColumns>(categorical && categorical.values || []),
            series: PrimitiveValue[] = categorical && values.source && this.GET_SERIES_VALUES(dataView);

        return categorical && mapValues(<any>new this<DataViewCategoryColumn[]>(), (n: any, key: string) => {
            return (<any[]>toArray(categories))
                .concat(<any[]>toArray(values))
                .filter((column: DataViewCategoryColumn) => column.source.roles && column.source.roles[key])
                .map((column: DataViewCategoryColumn) => column.values)[0]
                || values.source
                && values.source.roles
                && values.source.roles[key]
                && series;
        });
    }

    public static GET_SERIES_VALUES(dataView: DataView): PrimitiveValue[] {
        return dataView
            && dataView.categorical
            && dataView.categorical.values
            && dataView.categorical.values.map((column: DataViewCategoricalColumn) => {
                return column.source.groupName !== undefined
                    ? column.source.groupName
                    : column.source.queryName;
            });
    }

    public static GET_CATEGORICAL_COLUMNS(dataView: DataView): WordCloudColumns<DataViewCategoryColumn> {
        const categorical: DataViewCategorical = dataView && dataView.categorical,
            categories: DataViewCategoryColumn[] = categorical && categorical.categories || [],
            values: DataViewValueColumns = <DataViewValueColumns>(categorical && categorical.values || []);

        return categorical && mapValues(<any>(new this<DataViewCategoryColumn>()), (n: any, key: string) => {
            return categories.filter((column: DataViewCategoryColumn) => column.source.roles && column.source.roles[key])[0]
                || values.source
                && values.source.roles
                && values.source.roles[key]
                && values
                || values.filter((column: DataViewValueColumn) => column.source.roles && column.source.roles[key]);
        });
    }

    // Data Roles
    public Category?: T = null;
    public Values?: T = null;
    public Excludes?: T = null;
}
