export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface ItemTODO {
  id: string;
  title: string;
  description: string | null;
  done: boolean;
  order: number;
  listTODOId: string;
  categoryId: string | null;
  Category: Category | null;
}

export interface ListTodo {
  id: string;
  title: string;
  done: boolean;
  orderNumber: number;
  userId: string;
  ItemTODO: ItemTODO[];
}



/*

{
    "lists": [
        {
            "id": "clulsrbyt0001bgdt7hdbu2bu",
            "title": "teste2",
            "done": true,
            "orderNumber": 1,
            "userId": "clulpqr990000ld88fxx6ka04",
            "ItemTODO": []
        },
        {
            "id": "clulsslu40001day8ykpc4bo9",
            "title": "teste3",
            "done": true,
            "orderNumber": 2,
            "userId": "clulpqr990000ld88fxx6ka04",
            "ItemTODO": [
                {
                    "id": "clumtejtz0003lzpsv27o9ytc",
                    "title": "terceiro item",
                    "description": null,
                    "done": false,
                    "order": 1,
                    "listTODOId": "clulsslu40001day8ykpc4bo9",
                    "categoryId": null
                },
                {
                    "id": "clumtdxbv0001lzpsmkqercfc",
                    "title": "terceiro item",
                    "description": "teste da descricao",
                    "done": false,
                    "order": 2,
                    "listTODOId": "clulsslu40001day8ykpc4bo9",
                    "categoryId": null
                },
                {
                    "id": "clumt60dg00037ao88clho1a8",
                    "title": "terceiro item",
                    "description": "teste da descricao",
                    "done": false,
                    "order": 3,
                    "listTODOId": "clulsslu40001day8ykpc4bo9",
                    "categoryId": null
                }
            ]
        },
        {
            "id": "clulst5n50005day8pkuec5pt",
            "title": "testee",
            "done": true,
            "orderNumber": 3,
            "userId": "clulpqr990000ld88fxx6ka04",
            "ItemTODO": []
        },
        {
            "id": "clulstdi80007day86b0aa1zv",
            "title": "testee",
            "done": true,
            "orderNumber": 3,
            "userId": "clulpqr990000ld88fxx6ka04",
            "ItemTODO": []
        },
        {
            "id": "clulssx690003day8ps40ofmu",
            "title": "teste4",
            "done": true,
            "orderNumber": 4,
            "userId": "clulpqr990000ld88fxx6ka04",
            "ItemTODO": []
        }
    ]
}
*/