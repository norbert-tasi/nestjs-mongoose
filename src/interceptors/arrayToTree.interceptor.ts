import { Interceptor, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Interceptor()
export class ArrayToTreeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
        return call$.pipe(
            map((data) => {
                const options = { parentProperty: 'parent' };
                return this.arrayToTree(data, options);
            }),
        );
    }

    arrayToTree(data: Array<any>, options) {
        options = Object.assign(
            {
                parentProperty: 'parent_id',
                customID: '_id',
                rootID: '0',
            },
            options,
        );
        const grouped = this.groupByParents(data, options);
        return this.createTree(grouped, grouped[options.rootID], options.customID);
    }

    groupByParents(data, options) {
        return data.reduce((prev, item) => {
            let parentID = item[options.parentProperty];
            if (!parentID) {
                parentID = options.rootID;
            }

            if (parentID && prev.hasOwnProperty(parentID)) {
                prev[parentID].push(item);
                return prev;
            }

            prev[parentID] = [ item ];
            return prev;
        }, {});
    }

    createTree(data, rootNodes, customID): Array<any> {
        const tree = [];
        rootNodes.forEach((node) => {
            const childNodes = data[node[customID]];
            node._doc.data = { name: node.name, id: node._id };
            if (childNodes) {
                node._doc.children = this.createTree(data, childNodes, customID);
                node._doc.expanded = true;
            }
            tree.push(node);
        });

        return tree;
    }
}
