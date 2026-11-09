resource "azurerm_portal_dashboard" "app_dashboard" {
  name                = "${var.prefix}-monitoring-dashboard"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  tags = {
    Environment = "dev"
    ManagedBy   = "Terraform"
  }

  dashboard_properties = jsonencode({
    "lenses": {
      "0": {
        "order": 0,
        "parts": {
          "0": {
            "position": {
              "x": 0,
              "y": 0,
              "colSpan": 6,
              "rowSpan": 4
            },
            "metadata": {
              "inputs": [
                {
                  "name": "options",
                  "isOptional": true
                },
                {
                  "name": "sharedTimeRange",
                  "isOptional": true
                }
              ],
              "type": "Extension/HubsExtension/PartType/MonitorChartPart",
              "settings": {
                "content": {
                  "options": {
                    "chart": {
                      "metrics": [
                        {
                          "resourceMetadata": {
                            "id": "/subscriptions/917c3415-a3fd-4c48-9df2-c4838613d4c8/resourceGroups/cloudlab1-rg/providers/Microsoft.App/containerApps/cloudlab1-app"
                          },
                          "name": "Replicas",
                          "aggregationType": 4,
                          "namespace": "microsoft.app/containerapps",
                          "metricVisualization": {
                            "displayName": "Replica Count",
                            "resourceDisplayName": "cloudlab1-app"
                          }
                        }
                      ],
                      "title": "Avg Replica Count for cloudlab1-app",
                      "titleKind": 1,
                      "visualization": {
                        "chartType": 2,
                        "legendVisualization": {
                          "isVisible": true,
                          "position": 2,
                          "hideHoverCard": false,
                          "hideLabelNames": true
                        },
                        "axisVisualization": {
                          "x": {
                            "isVisible": true,
                            "axisType": 2
                          },
                          "y": {
                            "isVisible": true,
                            "axisType": 1,
                            "min": 0,
                            "max": 5
                          }
                        },
                        "disablePinning": true
                      }
                    }
                  }
                }
              }
            }
          },
          "1": {
            "position": {
              "x": 6,
              "y": 0,
              "colSpan": 6,
              "rowSpan": 4
            },
            "metadata": {
              "inputs": [
                {
                  "name": "options",
                  "isOptional": true
                },
                {
                  "name": "sharedTimeRange",
                  "isOptional": true
                }
              ],
              "type": "Extension/HubsExtension/PartType/MonitorChartPart",
              "settings": {
                "content": {
                  "options": {
                    "chart": {
                      "metrics": [
                        {
                          "resourceMetadata": {
                            "id": "/subscriptions/917c3415-a3fd-4c48-9df2-c4838613d4c8/resourceGroups/cloudlab1-rg/providers/Microsoft.App/containerApps/cloudlab1-app"
                          },
                          "name": "CpuPercentage",
                          "aggregationType": 4,
                          "namespace": "microsoft.app/containerapps",
                          "metricVisualization": {
                            "displayName": "CPU Usage Percentage (Preview)",
                            "resourceDisplayName": "cloudlab1-app"
                          }
                        }
                      ],
                      "title": "Avg CPU Usage Percentage (Preview) for cloudlab1-app",
                      "titleKind": 1,
                      "visualization": {
                        "chartType": 2,
                        "legendVisualization": {
                          "isVisible": true,
                          "position": 2,
                          "hideHoverCard": false,
                          "hideLabelNames": true
                        },
                        "axisVisualization": {
                          "x": {
                            "isVisible": true,
                            "axisType": 2
                          },
                          "y": {
                            "isVisible": true,
                            "axisType": 1
                          }
                        },
                        "disablePinning": true
                      }
                    }
                  }
                }
              },
              "filters": {
                "MsPortalFx_TimeRange": {
                  "model": {
                    "format": "utc",
                    "granularity": "1m",
                    "relative": "30m"
                  }
                }
              }
            }
          },
          "2": {
            "position": {
              "x": 0,
              "y": 4,
              "colSpan": 6,
              "rowSpan": 4
            },
            "metadata": {
              "inputs": [
                {
                  "name": "options",
                  "isOptional": true
                },
                {
                  "name": "sharedTimeRange",
                  "isOptional": true
                }
              ],
              "type": "Extension/HubsExtension/PartType/MonitorChartPart",
              "settings": {
                "content": {
                  "options": {
                    "chart": {
                      "metrics": [
                        {
                          "resourceMetadata": {
                            "id": "/subscriptions/917c3415-a3fd-4c48-9df2-c4838613d4c8/resourceGroups/cloudlab1-rg/providers/Microsoft.App/containerApps/cloudlab1-app"
                          },
                          "name": "Requests",
                          "aggregationType": 1,
                          "namespace": "microsoft.app/containerapps",
                          "metricVisualization": {
                            "displayName": "Requests",
                            "resourceDisplayName": "cloudlab1-app"
                          }
                        }
                      ],
                      "title": "Sum Requests for cloudlab1-app",
                      "titleKind": 1,
                      "visualization": {
                        "chartType": 2,
                        "legendVisualization": {
                          "isVisible": true,
                          "position": 2,
                          "hideHoverCard": false,
                          "hideLabelNames": true
                        },
                        "axisVisualization": {
                          "x": {
                            "isVisible": true,
                            "axisType": 2
                          },
                          "y": {
                            "isVisible": true,
                            "axisType": 1
                          }
                        },
                        "disablePinning": true
                      }
                    }
                  }
                }
              }
            }
          },
          "3": {
            "position": {
              "x": 6,
              "y": 4,
              "colSpan": 6,
              "rowSpan": 4
            },
            "metadata": {
              "inputs": [
                {
                  "name": "options",
                  "isOptional": true
                },
                {
                  "name": "sharedTimeRange",
                  "isOptional": true
                }
              ],
              "type": "Extension/HubsExtension/PartType/MonitorChartPart",
              "settings": {
                "content": {
                  "options": {
                    "chart": {
                      "metrics": [
                        {
                          "resourceMetadata": {
                            "id": "/subscriptions/917c3415-a3fd-4c48-9df2-c4838613d4c8/resourceGroups/cloudlab1-rg/providers/Microsoft.App/containerApps/cloudlab1-app"
                          },
                          "name": "Requests",
                          "aggregationType": 1,
                          "namespace": "microsoft.app/containerapps",
                          "metricVisualization": {
                            "displayName": "Requests",
                            "resourceDisplayName": "cloudlab1-app"
                          }
                        }
                      ],
                      "title": "Sum Requests for cloudlab1-app where Status Code = '500'",
                      "titleKind": 1,
                      "visualization": {
                        "chartType": 2,
                        "legendVisualization": {
                          "isVisible": true,
                          "position": 2,
                          "hideHoverCard": false,
                          "hideLabelNames": true
                        },
                        "axisVisualization": {
                          "x": {
                            "isVisible": true,
                            "axisType": 2
                          },
                          "y": {
                            "isVisible": true,
                            "axisType": 1
                          }
                        },
                        "disablePinning": true
                      },
                      "filterCollection": {
                        "filters": [
                          {
                            "key": "statusCode",
                            "operator": 0,
                            "values": [
                              "500"
                            ]
                          }
                        ]
                      }
                    }
                  }
                }
              },
              "filters": {
                "statusCode": {
                  "model": {
                    "operator": "equals",
                    "values": [
                      "500"
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    "metadata": {
      "model": {
        "timeRange": {
          "value": {
            "relative": {
              "duration": 24,
              "timeUnit": 1
            }
          },
          "type": "MsPortalFx.Composition.Configuration.ValueTypes.TimeRange"
        },
        "filterLocale": {
          "value": "en-us"
        },
        "filters": {
          "value": {
            "MsPortalFx_TimeRange": {
              "model": {
                "format": "utc",
                "granularity": "1m",
                "relative": "30m"
              },
              "displayCache": {
                "name": "UTC Time",
                "value": "Past 30 minutes"
              },
              "filteredPartIds": [
                "StartboardPart-MonitorChartPart-bed8f145-d509-4ac4-a1aa-afba0ea272f3",
                "StartboardPart-MonitorChartPart-bed8f145-d509-4ac4-a1aa-afba0ea273e2",
                "StartboardPart-MonitorChartPart-bed8f145-d509-4ac4-a1aa-afba0ea273f4",
                "StartboardPart-MonitorChartPart-bed8f145-d509-4ac4-a1aa-afba0ea27400"
              ]
            }
          }
        }
      }
    }
  })
}