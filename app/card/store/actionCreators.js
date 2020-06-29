import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox, Select, TimePicker, Result } from "antd";
import { Link } from "react-router-dom";

import { inject } from "mobx-react";
import moment from "moment";
import * as urls from '@constant/urls'
import { inject } from "mobx-react";

async function getwithoutpage(params) {
	const r = await axios.post(urls.API_NOPAGE_POS_LIST, params)
	return r
}

export const getpage = (page, setContent) => {
	getwithoutpage(page).then((data) => {
		console.log(data)
	
		if (data.status === 200) {
			setContent(data)
			this.setState({
				
				
			});
		}
	});
};