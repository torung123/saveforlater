import React from 'react';
import { Statistic } from 'semantic-ui-react'

const homeviewheader = () => (
  <Statistic.Group widths='three'>
    <Statistic>
      <Statistic.Label>Hôm nay</Statistic.Label>
      <Statistic.Value>22</Statistic.Value>
    </Statistic>
    <Statistic>
        <Statistic.Label>Tổng thêm vào yêu thích</Statistic.Label>
      <Statistic.Value>
        5
      </Statistic.Value>
    </Statistic>
    <Statistic>
    <Statistic.Label>Tổng lưu lại mua sau</Statistic.Label>
      <Statistic.Value>
        42
      </Statistic.Value>
    </Statistic>
    
  </Statistic.Group>
)

export default homeviewheader