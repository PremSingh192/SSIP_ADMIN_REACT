data = {
    "data": [
        {
            "branch_name": "TEST_BRANCH_FOR_CORE_TEAM",
            "branch_code": "69",
            "slug": "118438_1709302902",
            "semesters": [
                {
                    "slug": "744780_1709303587",
                    "no": 6,
                    "status": true,
                    "divisions": [
                        {
                            "division_name": "B",
                            "slug": "282865_1709303596",
                            "timetable": {
                                "slug": "323222_1709303596",
                                "schedule": {
                                    "day": "tuesday",
                                    "slug": "169640_1709303596",
                                    "lectures": [
                                        {
                                            "start_time": "13:01:00",
                                            "end_time": "20:00:00",
                                            "type": "theory",
                                            "subject": {
                                                "slug": "445594_1709304525",
                                                "subject_name": "TEST_SUBJECT",
                                                "code": "69",
                                                "credit": 69,
                                                "semester": {
                                                    "slug": "744780_1709303587",
                                                    "no": 6,
                                                    "status": true
                                                }
                                            },
                                            "teacher": "Manav Shah",
                                            "classroom": {
                                                "class_name": "TEST",
                                                "slug": "265201_1709576133"
                                            },
                                            "batches": [
                                                {
                                                    "slug": "305594_1709303606",
                                                    "batch_name": "B1",
                                                    "division": {
                                                        "division_name": "B",
                                                        "slug": "282865_1709303596"
                                                    }
                                                },
                                                {
                                                    "slug": "248435_1709303609",
                                                    "batch_name": "B2",
                                                    "division": {
                                                        "division_name": "B",
                                                        "slug": "282865_1709303596"
                                                    }
                                                },
                                                {
                                                    "slug": "814661_1709303611",
                                                    "batch_name": "B3",
                                                    "division": {
                                                        "division_name": "B",
                                                        "slug": "282865_1709303596"
                                                    }
                                                },
                                                {
                                                    "slug": "283524_1709303613",
                                                    "batch_name": "B4",
                                                    "division": {
                                                        "division_name": "B",
                                                        "slug": "282865_1709303596"
                                                    }
                                                }
                                            ],
                                            "slug": "467049_1709631119",
                                            "session": {
                                                "session_id": "6646247d7e31b6939fa37f5270e61b21aaf192cbfa3df9ccd59f10ea0722ceec",
                                                "active": "ongoing",
                                                "day": "2024-03-05",
                                                "created_at": "2024-03-05T15:01:59.563010+05:30"
                                            },
                                            "is_active": true,
                                            "is_proxy": false,
                                            "link": null
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            ]
        },
        {
            "branch_name": "Computer Engineering - BE",
            "branch_code": "7",
            "slug": "119147_1708935897",
            "semesters": [
                {
                    "slug": "337247_1708936525",
                    "no": 6,
                    "status": true,
                    "divisions": [
                        {
                            "division_name": "A",
                            "slug": "222925_1708936540",
                            "timetable": {
                                "slug": "241486_1708936540",
                                "schedule": {
                                    "day": "tuesday",
                                    "slug": "254153_1708936540",
                                    "lectures": []
                                }
                            }
                        },
                        {
                            "division_name": "B",
                            "slug": "124282_1708936544",
                            "timetable": {
                                "slug": "280687_1708936544",
                                "schedule": {
                                    "day": "tuesday",
                                    "slug": "266997_1708936544",
                                    "lectures": []
                                }
                            }
                        },
                        {
                            "division_name": "C",
                            "slug": "281492_1708936549",
                            "timetable": {
                                "slug": "273919_1708936550",
                                "schedule": {
                                    "day": "tuesday",
                                    "slug": "975733_1708936550",
                                    "lectures": []
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ],
    "error": false,
    "message": null
}

let lectures = []
data.data.map((branch,br_index) => {
    lectures[branch.branch_name] = []
    branch.semesters.map((semester,sem_index) => {
        semester.divisions.map((division,div_index) => {
            division.timetable.schedule.lectures.length > 0 && division.timetable.schedule.lectures.map((lecture,lecture_index) => {
              lecture.branch = branch.branch_name
              lecture.semester = semester.no
              lecture.division = division.division_name
              lectures[branch.branch_name].push(lecture)
            });
        })
    })
})

// console.log(lectures)