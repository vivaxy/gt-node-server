import http from 'http';
import { Transform } from 'stream';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { renderToNodeStream } from 'react-dom/server';

import httpMethods from '../conf/httpMethods';
import httpStatusCodes from '../conf/httpStatusCodes';
import { nodeServerInner } from '../conf/paths';
import ArgTypes from './ArgTypes';

/**
 * Use params first
 * @param ctx
 * @returns {{}}
 */
const getArgsFromRequest = ctx => {
    switch (ctx.request.method) {
        case httpMethods.GET:
            return { ...ctx.request.query, ...ctx.request.params };
        case httpMethods.POST:
            return { ...ctx.request.body, ...ctx.request.params };
    }
};

class Head extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired
    };

    render() {
        return (
            <head>
                <title>{this.props.title}</title>
            </head>
        );
    }
}

class PageFrame extends Component {
    render() {
        return (
            <html>
                <Head title="title" />
                <body>
                    {this.props.children}
                    {this.props.scripts.map(href => {
                        return <script src={href} />;
                    })}
                </body>
            </html>
        );
    }
}

export default class Action {
    constructor(ctx) {
        this.argTypes = {};
        this.defaultArgs = {};

        this.ctx = ctx;
        this.method = ctx.request.method;
        this.args = {};
    }

    validate(args) {
        ArgTypes.check(this.argTypes, args);
        return ArgTypes.merge(args, this.defaultArgs);
    }

    async execute() {
        const { method } = this;
        const handler = this[method.toLowerCase()];
        if (handler) {
            try {
                this.args = this.validate(getArgsFromRequest(this.ctx));
            } catch (ex) {
                this.setStatus(httpStatusCodes.BAD_REQUEST);
                this.setBody(ex.stack);
                return;
            }
            try {
                return await handler.call(this, this.args);
            } catch (ex) {
                this.setStatus(httpStatusCodes.INTERNAL_SERVER_ERROR);
                this.setBody(ex.stack);
                return;
            }
        } else {
            this.setStatusAndBodyByStatusCode(
                httpStatusCodes.METHOD_NOT_ALLOWED
            );
            return;
        }
    }

    setHeader(key, value) {
        return this.ctx.response.set(key, value);
    }

    setStatus(code) {
        return (this.ctx.response.status = code);
    }

    setBody(body) {
        return (this.ctx.response.body = body);
    }

    setStatusAndBodyByStatusCode(code) {
        this.setStatus(code);
        this.setBody(http.STATUS_CODES[code]);
    }

    render(Component) {
        const doctype = new Transform({
            transform(chunk, encoding, done) {
                this.push('<!DOCTYPE html>');
                this.push(chunk);
                return done();
            }
        });
        this.setBody(
            renderToNodeStream(
                <PageFrame
                    scripts={[
                        `/${nodeServerInner}/react.js`,
                        `/${nodeServerInner}/react-dom.js`,
                        `/${nodeServerInner}/node-server.js`
                    ]}
                >
                    <Component />
                </PageFrame>
            ).pipe(doctype)
        );
        this.setHeader('Content-Type', 'text/html');
    }
}
