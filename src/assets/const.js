export const data = [
    {name:'标签一',id:1,age:1},
    {name:'标签二',id:2,age:2},
    {
        name:'标签三',
        id:3,
        age:3,
        children:[
            {name:'标签三-一',id:31,age:31},
            {name:'标签三-二',id:32,age:41},
            {name:'标签三-三',id:33,age:51},
        ]
    },
    {
        name:'标签四',
        id:4,
        age:6,
        children:[
            {name:'标签四-一',id:41,age:7},
            {
                name:'标签四-二',
                id:42,
                age:8,
                children:[
                    {name:'标签四-二-一',id:421,age:9},
                    {name:'标签四-二-二',id:422,age:10},
                    {name:'标签四-二-三',id:423,age:11},
                ]
            },
            {name:'标签四-三',id:43,age:12},
        ]
    },
]

export const props = {
    children: "children",
    label: "name",
    value: "id",
}