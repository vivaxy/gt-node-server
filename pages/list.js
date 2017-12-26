/**
 * @since 20171226 16:42
 * @author vivaxy
 */

import React from 'react';
import Link from 'next/link';

import fetch from '../client/fetch';

const List = ({ list }) => (
    <div>
        <Link href="/"><p>go to /</p></Link>
        <ul>{
            list.map((item) => {
                return <li key={item}>{item}</li>
            })
        }</ul>
    </div>
);

List.getInitialProps = async({ req }) => {
    const response = await fetch({ req, path: '/demo' });
    return { list: response.list };
};

export default List;
