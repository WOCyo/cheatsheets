import React, { useState, useCallback } from 'react'
import { NextPage, GetServerSideProps } from 'next'
import Link from 'next/link'
import useSWR from 'swr'

import { api, Github } from '~/api'
import Layout from '~/components/Layout'
import { Meta } from '~/components/Meta'
import pkg from 'package.json'
import { Sheet } from '~/components/Sheet'

const IndexPage: NextPage<{ data: Github.Label[] }> = props => {
  const { data } = useSWR(`${pkg.author.name}-${pkg.name}-labels`, api.github.client.labels, {
    initialData: props.data,
  })
  const [keyword, setKeyword] = useState<string>()
  const [issues, setIssues] = useState<Github.Issue[]>([])
  const handleSearch = useCallback(async value => {
    const data = await api.github.client.search(value)
    setIssues(data.items)
  }, [])
  return (
    <Layout>
      <Meta />
      <div className="contianer flex flex-col items-center justify-center w-full h-full bg-gray-100">
        <h1 className="label lg:text-5xl text-xl text-gray-700 lg:mb-10 mb-0">
          {pkg.author.name}'s <span className="text-gray-500">cheatsheets</span>
        </h1>
        <input
          placeholder="label name"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSearch(keyword)
            }
          }}
          onChange={async e => {
            setKeyword(e.target.value)
          }}
          className="shadow appearance-none border focus:outline-none focus:shadow-outline md:w-2/4 lg:w-2/4 w-11/12 h-12 text-gray-500 rounded m-8 p-2"
        />
        {issues.map(v => {
          return <Sheet v={v} />
        })}
        <ul className="list-disc grid lg:grid-cols-3 lg:w-2/4 grid-cols-2 w-8/12 list-inside">
          {data
            ?.filter(v => !v.default)
            .map(v => {
              return (
                <li className="text-blue-800 cursor-pointer hover:text-blue-500" key={v.name}>
                  <Link href="/sheet/[id]" as={`/sheet/${v.name}`}>
                    {v.name}
                  </Link>
                </li>
              )
            })}
        </ul>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(_ctx: Parameters<GetServerSideProps>[0]) {
  const data = await api.github.client.labels()
  return { props: { data } }
}

export default IndexPage
