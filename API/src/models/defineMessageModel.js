// MIT License
// Copyright (C) 2019-Present Takram

import Sequelize from 'sequelize'

export default function defineMessageModel (sequelize) {
  return sequelize.define(
    'message',
    {
      date: {
        type: Sequelize.DATE,
        primaryKey: true,
        allowNull: false
      },
      rssi: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      snr: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      gatewayId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      frequency: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      counter: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      data: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deviceId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dataRate: {
        type: Sequelize.STRING,
        allowNull: false
      },
      port: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    },
    {
      indexes: [
        {
          fields: ['deviceId'],
          unique: false
        }
      ]
    }
  )
}
