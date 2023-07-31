const views = {
    stages: [
        {
            id: 1,
            stage: 1,
            ...stageOne
        },
    
        {
            id: 2,
            stage: 2,
            ...stageTwo,

        },
    
        {
            id: 3,
            stage: 3,
            ...stageThree
        },
    
        {
            id: 4,
            stage: 4,
            ...stageFour
        }
    ],

    panels: [
        {
            id: 1,
            view: (stage = null) => leftPanel(stage)
        },
        {
            id: 2,
            view: () => rightPanel()
        },
    ]
}