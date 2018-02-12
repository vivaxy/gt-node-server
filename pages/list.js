/**
 * @since 20171226 16:42
 * @author vivaxy
 */

const React = require('react');

const fetch = require('../client/fetch');

const List = ({ list }) => (
    <div>
        <Link href="/">
            <p>go to /</p>
        </Link>
        <ul>
            {list.map(item => {
                return <li key={item}>{item}</li>;
            })}
        </ul>
    </div>
);

List.getInitialProps = async ({ req }) => {
    const response = await fetch({ req, path: '/demo' });
    return { list: response.list };
};

export default List;
