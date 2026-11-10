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
          },
          "4": {
            "position": {
              "x": 12,
              "y": 0,
              "colSpan": 6,
              "rowSpan": 4
            },
            "metadata": {
              "inputs": [
                {
                  "name": "ResourceId",
                  "value": "/subscriptions/917c3415-a3fd-4c48-9df2-c4838613d4c8/resourceGroups/cloudlab1-rg/providers/Microsoft.Insights/components/cloudlab1-appinsights"
                },
                {
                  "name": "ComponentId",
                  "value": {
                    "SubscriptionId": "917c3415-a3fd-4c48-9df2-c4838613d4c8",
                    "ResourceGroup": "cloudlab1-rg",
                    "Name": "cloudlab1-appinsights",
                    "LinkedApplicationType": 0,
                    "ResourceId": "/subscriptions/917c3415-a3fd-4c48-9df2-c4838613d4c8/resourceGroups/cloudlab1-rg/providers/Microsoft.Insights/components/cloudlab1-appinsights",
                    "ResourceType": "microsoft.insights/components",
                    "IsAzureFirst": false
                  }
                },
                {
                  "name": "TargetBlade",
                  "value": "Performance"
                },
                {
                  "name": "DataModel",
                  "value": {
                    "version": "1.0.0",
                    "experience": 1,
                    "clientTypeMode": "Server",
                    "timeContext": {
                      "durationMs": 1800000
                    },
                    "prefix": "let OperationIdsWithExceptionType = (excType: string) { exceptions | where timestamp > ago(30m) \n    | where tobool(iff(excType == \"null\", isempty(type), type == excType)) \n    | distinct operation_ParentId };\nlet OperationIdsWithFailedReqResponseCode = (respCode: string) { requests | where timestamp > ago(30m)\n    | where iff(respCode == \"null\", isempty(resultCode), resultCode == respCode) and success == false \n    | distinct id };\nlet OperationIdsWithFailedDependencyType = (depType: string) { dependencies | where timestamp > ago(30m)\n    | where iff(depType == \"null\", isempty(type), type == depType) and success == false \n    | distinct operation_ParentId };\nlet OperationIdsWithFailedDepResponseCode = (respCode: string) { dependencies | where timestamp > ago(30m)\n    | where iff(respCode == \"null\", isempty(resultCode), resultCode == respCode) and success == false \n    | distinct operation_ParentId };\nlet OperationIdsWithExceptionBrowser = (browser: string) { exceptions | where timestamp > ago(30m)\n    | where tobool(iff(browser == \"null\", isempty(client_Browser), client_Browser == browser)) \n    | distinct operation_ParentId };",
                    "percentile": 3,
                    "grain": "1m",
                    "selectedOperation": null,
                    "selectedOperationName": null,
                    "filters": []
                  },
                  "isOptional": true
                },
                {
                  "name": "Version",
                  "value": "1.0"
                }
              ],
              "type": "Extension/AppInsightsExtension/PartType/PerformanceCuratedPinnedChartPart",
              "asset": {
                "idInputName": "ResourceId",
                "type": "ApplicationInsights"
              }
            }
          },
          "5": {
            "position": {
              "x": 12,
              "y": 4,
              "colSpan": 6,
              "rowSpan": 4
            },
            "metadata": {
              "inputs": [
                {
                  "name": "ResourceId",
                  "value": "/subscriptions/917c3415-a3fd-4c48-9df2-c4838613d4c8/resourceGroups/cloudlab1-rg/providers/Microsoft.Insights/components/cloudlab1-appinsights"
                },
                {
                  "name": "ComponentId",
                  "value": {
                    "SubscriptionId": "917c3415-a3fd-4c48-9df2-c4838613d4c8",
                    "ResourceGroup": "cloudlab1-rg",
                    "Name": "cloudlab1-appinsights",
                    "LinkedApplicationType": 0,
                    "ResourceId": "/subscriptions/917c3415-a3fd-4c48-9df2-c4838613d4c8/resourceGroups/cloudlab1-rg/providers/Microsoft.Insights/components/cloudlab1-appinsights",
                    "ResourceType": "microsoft.insights/components",
                    "IsAzureFirst": false
                  }
                },
                {
                  "name": "TargetBlade",
                  "value": "Performance"
                },
                {
                  "name": "DataModel",
                  "value": {
                    "version": "1.0.0",
                    "experience": 1,
                    "clientTypeMode": "Server",
                    "timeContext": {
                      "durationMs": 1800000
                    },
                    "prefix": "let OperationIdsWithExceptionType = (excType: string) { exceptions | where timestamp > ago(30m) \n    | where tobool(iff(excType == \"null\", isempty(type), type == excType)) \n    | distinct operation_ParentId };\nlet OperationIdsWithFailedReqResponseCode = (respCode: string) { requests | where timestamp > ago(30m)\n    | where iff(respCode == \"null\", isempty(resultCode), resultCode == respCode) and success == false \n    | distinct id };\nlet OperationIdsWithFailedDependencyType = (depType: string) { dependencies | where timestamp > ago(30m)\n    | where iff(depType == \"null\", isempty(type), type == depType) and success == false \n    | distinct operation_ParentId };\nlet OperationIdsWithFailedDepResponseCode = (respCode: string) { dependencies | where timestamp > ago(30m)\n    | where iff(respCode == \"null\", isempty(resultCode), resultCode == respCode) and success == false \n    | distinct operation_ParentId };\nlet OperationIdsWithExceptionBrowser = (browser: string) { exceptions | where timestamp > ago(30m)\n    | where tobool(iff(browser == \"null\", isempty(client_Browser), client_Browser == browser)) \n    | distinct operation_ParentId };",
                    "percentile": 4,
                    "grain": "1m",
                    "selectedOperation": null,
                    "selectedOperationName": null,
                    "filters": []
                  },
                  "isOptional": true
                },
                {
                  "name": "Version",
                  "value": "1.0"
                }
              ],
              "type": "Extension/AppInsightsExtension/PartType/PerformanceCuratedPinnedChartPart",
              "asset": {
                "idInputName": "ResourceId",
                "type": "ApplicationInsights"
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

resource "azurerm_application_insights" "appinsights" {
  name                = "${var.prefix}-appinsights"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  workspace_id        = azurerm_log_analytics_workspace.logs.id # Uses existing workspace
  application_type    = "Node.JS"
}