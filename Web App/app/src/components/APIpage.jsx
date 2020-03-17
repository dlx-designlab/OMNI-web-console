import React from 'react'

import classes from './App.scss'

export default function APIPage () {
  return (
    <div className={classes.apipagetext}>
      <h1>API</h1>
      <p>
        OMNI uses an API to provide free and open access to all OMNI data. Using
        this API you can download and analyses the data, build a unique data
        platform for your community or use an IOT platform to use your data in
        new and imaginitive ways.
      </p>
      <p>
        Access the API <a href='https://omni-platform.appspot.com/'>here</a>
      </p>
      <br />
      The API can be accessed in any language you are comfortable in, we will
      share some examples for Python to help get you started!
      <h2>Python</h2>
      Load requests
      <h2>Example Queries</h2>
      <pre
        style={{
          backgroundColor: 'rgb(240,240,240)',
          border: 'solid 2px grey'
        }}
      >
        {`
    query getMessages {
      devices {
          name
          id
          messages (orderBy: { field: "date", direction: DESC } perPage: 1) {
            date
            data {
              latitude
              longitude
            }
          }
        }
      }
          `}
      </pre>
      <p>
        This code will return the latest position for all OMNIs on the server. A
        typical output would look like:
      </p>
      <pre
        style={{
          backgroundColor: 'rgb(240,240,240)',
          border: 'solid 2px grey',
          height: '250px',
          overflow: 'auto'
        }}
      >
        {`
    {
      "data": {
        "devices": [
          {
            "name": "OMNI LoRa1",
            "id": "000b78fffe0519b3",
            "messages": []
          },
          {
            "name": "OMNI LoRa2",
            "id": "000b78fffe0519c2",
            "messages": []
          },
          {
            "name": "OMNI LoRa3",
            "id": "000b78fffe051a11",
            "messages": [
              {
                "date": "2020-02-19T07:58:38.979Z",
                "data": {
                  "latitude": 34.7559700012207,
                  "longitude": 137.52027893066406
                }
              }
            ]
          },
          {
            "name": "OMNI LoRa4",
            "id": "000b78fffe051993",
            "messages": []
          },
          {
            "name": "OMNI Bordeaux",
            "id": "000b78fffe052cfc",
            "messages": []
          },
          {
            "name": "OMNI LoRa6",
            "id": "000b78fffe052c12",
            "messages": [
              {
                "date": "2020-02-14T07:38:04.480Z",
                "data": {
                  "latitude": 35.660423278808594,
                  "longitude": 139.67703247070312
                }
              }
            ]
          },
          {
            "name": "OMNI LoRa7",
            "id": "000b78fffe052c48",
            "messages": [
              {
                "date": "2020-02-19T07:49:12.115Z",
                "data": {
                  "latitude": 35.66089630126953,
                  "longitude": 139.6768035888672
                }
              }
            ]
          },
          {
            "name": "OMNI LoRa8",
            "id": "000b78fffe052cc0",
            "messages": [
              {
                "date": "2020-02-19T08:00:05.328Z",
                "data": {
                  "latitude": 34.75616455078125,
                  "longitude": 137.520263671875
                }
              }
            ]
          },
          {
            "name": "OMNI LoRa9",
            "id": "000b78fffe052cea",
            "messages": [
              {
                "date": "2020-02-19T07:39:15.673Z",
                "data": {
                  "latitude": 34.755985260009766,
                  "longitude": 137.5202178955078
                }
              }
            ]
          },
          {
            "name": "OMNI LoRa10",
            "id": "000b78fffe052cb6",
            "messages": [
              {
                "date": "2020-02-19T07:50:13.351Z",
                "data": {
                  "latitude": 34.755863189697266,
                  "longitude": 137.52020263671875
                }
              }
            ]
          },
          {
            "name": "OMNI LoRa11",
            "id": "000b78fffe052cfd",
            "messages": [
              {
                "date": "2020-02-19T07:51:19.810Z",
                "data": {
                  "latitude": 34.75601577758789,
                  "longitude": 137.52020263671875
                }
              }
            ]
          },
          {
            "name": "OMNI LoRa12",
            "id": "000b78fffe052c4b",
            "messages": [
              {
                "date": "2020-02-19T08:02:02.011Z",
                "data": {
                  "latitude": 34.75613784790039,
                  "longitude": 137.5200958251953
                }
              }
            ]
          },
          {
            "name": "OMNI LoRa13",
            "id": "000b78fffe052d24",
            "messages": [
              {
                "date": "2020-02-19T07:37:11.361Z",
                "data": {
                  "latitude": 34.75602340698242,
                  "longitude": 137.52015686035156
                }
              }
            ]
          },
          {
            "name": "OMNI LoRa14",
            "id": "000b78fffe052c7f",
            "messages": [
              {
                "date": "2020-02-19T07:52:54.581Z",
                "data": {
                  "latitude": 34.756011962890625,
                  "longitude": 137.5202178955078
                }
              }
            ]
          },
          {
            "name": "OMNI LoRa15",
            "id": "000b78fffe052cce",
            "messages": [
              {
                "date": "2020-02-19T07:37:47.471Z",
                "data": {
                  "latitude": 34.75593948364258,
                  "longitude": 137.5202178955078
                }
              }
            ]
          },
          {
            "name": "OMNI LoRa16",
            "id": "000b78fffe052c18",
            "messages": [
              {
                "date": "2020-02-17T08:42:35.490Z",
                "data": {
                  "latitude": 34.75605392456055,
                  "longitude": 137.52012634277344
                }
              }
            ]
          },
          {
            "name": "OMNI LoRa17",
            "id": "000b78fffe0519ec",
            "messages": [
              {
                "date": "2020-02-12T06:36:07.537Z",
                "data": {
                  "latitude": 35.66050338745117,
                  "longitude": 139.6771240234375
                }
              }
            ]
          },
          {
            "name": "OMNI LoRa18",
            "id": "000b78fffe051A11",
            "messages": []
          }
        ]
      }
    }
          `}
      </pre>
    </div>
  )
}
