import Sider from 'antd/es/layout/Sider'
import { Fragment, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { getThemeToken } from '../../../utils/styles'
import { useGlobalTheme } from '../../../context/GlobalThemeContext'
import SiderMenu from './SiderMenu'

const _Sider = styled(Sider)`
  padding-top: ${getThemeToken('paddingMD', 'px')};
  height: 100%;
  z-index: 2;
`

const Mask = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 1;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
`

const SiderNav = () => {
  const { onWidth } = useGlobalTheme()
  const [collapsed, setCollapsed] = useState(true)
  const theme = useTheme()
  const siderWidth = onWidth({
    sm: '70%',
    defaultValue: undefined,
  })
  const collapsedWidth = onWidth({
    sm: 0,
    defaultValue: undefined,
  })
  const zeroWidthTriggerStyle = {
    height: 25,
    width: 25,
    marginRight: 15,
    top: '10%',
    backgroundColor: theme.themeColor.highlight,
  }
  const siderStyle = {
    position: onWidth({
      sm: 'fixed',
      defaultValue: 'unset',
    }),
  }
  return (
    <Fragment>
      <Mask
        visible={!collapsed}
        onClick={() => {
          setCollapsed(true)
        }}
      />

      <_Sider
        collapsible
        defaultCollapsed
        collapsed={collapsed}
        width={siderWidth}
        collapsedWidth={collapsedWidth}
        zeroWidthTriggerStyle={zeroWidthTriggerStyle}
        onCollapse={() => {
          setCollapsed(!collapsed)
        }}
        style={siderStyle}
      >
        <SiderMenu setCollapsed={setCollapsed} />
      </_Sider>
    </Fragment>
  )
}

export default SiderNav
