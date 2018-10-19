import {groupBy} from 'lodash';

export class DateUtil {
    static groupByDateDay(collection: Array<any>, dateSelector: Function) {
        return groupBy(collection, (item) => {
            return new Date(dateSelector(item)).toISOString().slice(0, 10);
        });
    }
}
