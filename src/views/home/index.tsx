import React from 'react'
import { useSetState } from '0hook'
import { Button, Flex, Grid, Input } from 'aurad'
import { isArray } from 'asura-eye'
import { ObjectType } from '0type'
import './index.less'

export default function Home() {

  const [state, setState] = useSetState<{
    name: string
    version: string
    template: 'react' | 'vue' | 'static'
    [key: string]: any
  }>({
    name: '',
    version: 'latest',
    template: 'react',
    open: false,
    dependencies: {
      static: [],
      react: [
        ['antd', 'latest'],
        ['0type', 'latest'],
        ['aurad', 'latest'],
        ['abandonjs', 'latest'],
        ['asura-eye', 'latest'],
        ['axios', 'latest'],
      ],
      vue: [
        ['element-plus', 'latest'],
        ['0type', 'latest'],
        ['aurad', 'latest'],
        ['abandonjs', 'latest'],
        ['asura-eye', 'latest'],
        ['axios', 'latest'],
      ],
    },
  })

  const { template = 'react', name, version } = state

  const banAdd = () => {
    if (!name || !version) return true
    if (isArray(state?.dependencies?.[template])) {
      const list = state.dependencies[template]?.map((_) => _[0])
      if (list.includes(name)) return true
    }
    return false
  }
  const onAdd = () => {
    let { name, version = '', template = 'react' } = state
    try {
      if (!Number.isNaN(Number(version[0]))) {
        version = '^' + version
      }
      if (isArray(state.dependencies[template]))
        state.dependencies[template].push([name, version])
      else state.dependencies[template] = [[name, version]]
      state.name = ''
      state.version = 'latest'
      setState(state)
    } catch (error) {
      console.log(error)
    }
  }
  const onDel = (name: string) => {
    try {
      if (isArray(state?.dependencies?.[template])) {
        state.dependencies[template] = state.dependencies[template].filter(
          (item: string[]) => item[0] !== name,
        )
        setState(state)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getDependencies = () => {
    const renderDependencies: ObjectType<string> = {
      template,
    }
    if (isArray(state?.dependencies?.[template])) {
      state.dependencies[template].forEach((item: any) => {
        const [name, version] = item
        renderDependencies[name] = version
      })
    }
    return renderDependencies
  }

  const handleOpenSandbox = () => {
    const value = new URLSearchParams(getDependencies()).toString()
    window.open('/#/sandbox' + (value ? '?' + value : ''), '_blank')
    setState({
      open: false,
    })
  }

  return (
    <Grid className="home" style={{ padding: 20 }}>
      <Flex>
        {['static', 'react', 'vue'].map((name) => (
          <Button
            key={name}
            type={state.template === name ? 'primary' : 'default'}
            onClick={() => setState({ template: name as any })}
          >
            {name}
          </Button>
        ))}
      </Flex>
      <div className="dependencies">
        <h3
          style={{
            marginBottom: 10,
          }}
        >
          dependencies
        </h3>
        <Grid
          style={{
            gridTemplateColumns: 'minmax(200px, 1fr) 200px 180px',
          }}
        >
          {isArray(state.dependencies?.[template]) ? (
            state.dependencies[template].map((item: string[]) => {
              const [name, version] = item
              return (
                <React.Fragment key={name}>
                  <div className="name">{name}</div>
                  <div className="version">{version}</div>
                  <Button
                    title="Del"
                    className="control"
                    onClick={() => onDel(name)}
                  >
                    Del
                  </Button>
                </React.Fragment>
              )
            })
          ) : (
            <div style={{ gridColumn: '1 / -1' }} />
          )}
          <Input
            value={state.name}
            onChange={(e: any) => {
              setState({ name: e.target.value })
            }}
          />
          <Input
            value={state.version}
            onChange={(e: any) => {
              setState({ version: e.target.value })
            }}
          />
          <Button
            className="control"
            onClick={onAdd}
            disabled={banAdd()}
          >
            Add
          </Button>
        </Grid>
      </div>
      <Button type="primary" onClick={handleOpenSandbox}>
        Open Sandbox
      </Button>
    </Grid>
  )
}
