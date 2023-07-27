const views = {
    stages: [
        {
            id: 1,
            stage: 1,
            view: data => stageOne(data)
        },
    
        {
            id: 2,
            stage: 2,
            view: data => stageTwo(data)
        },
    
        {
            id: 3,
            stage: 3,
            view: data => stageThree(data)
        },
    
        {
            id: 4,
            stage: 4,
            view: data => stageFour(data)
        }
    ],

    panels: [
        {
            id: 1,
            view: () => leftPanel()
        },
        {
            id: 2,
            view: () => rightPanel()
        },
    ]
}