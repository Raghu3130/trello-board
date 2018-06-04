

const axios = require('axios');

const PostsController = {

	addOne: ( args ) => {
		const URL = `https://www.reddit.com/r/${ args.subreddit || 'javascript' }.json`;
		return axios.get( URL )
			.then( (response) => {
				const __posts = [];
				const posts = response.data.data.children;

				posts.map( post => {
					post.data.content = post.data.selftext_html;
					__posts.push( post.data );
				} );
				return __posts;
			})
			.catch( (error) => {
				return { error: error }
			});

  },
  add: ( args ) => {
		const URL = `https://www.reddit.com/r/${ args.subreddit || 'javascript' }.json`;
		return axios.get( URL )
			.then( (response) => {
				const __posts = [];
				const posts = response.data.data.children;

				posts.map( post => {
					post.data.content = post.data.selftext_html;
					__posts.push( post.data );
				} );
				return __posts;
			})
			.catch( (error) => {
				return { error: error }
			});

  },
  addOne: ( args ) => {
    const URL = `https://www.reddit.com/r/${ args.subreddit || 'javascript' }.json`;
		return axios.get( URL )
			.then( (response) => {
				const __posts = [];
				const posts = response.data.data.children;

				posts.map( post => {
					post.data.content = post.data.selftext_html;
					__posts.push( post.data );
				} );
				return __posts;
			})
			.catch( (error) => {
				return { error: error }
			});
	},
	update: ( args ) => {
		const URL = `https://www.reddit.com/r/${ args.subreddit || 'javascript' }.json`;
		return axios.get( URL )
			.then( (response) => {
				const __posts = [];
				const posts = response.data.data.children;

				posts.map( post => {
					post.data.content = post.data.selftext_html;
					__posts.push( post.data );
				} );
				return __posts;
			})
			.catch( (error) => {
				return { error: error }
			});

	},
	delete: ( args ) => {
		const URL = `https://www.reddit.com/r/${ args.subreddit || 'javascript' }.json`;
		return axios.get( URL )
			.then( (response) => {
				const __posts = [];
				const posts = response.data.data.children;

				posts.map( post => {
					post.data.content = post.data.selftext_html;
					__posts.push( post.data );
				} );
				return __posts;
			})
			.catch( (error) => {
				return { error: error }
			});

	},
	count: ( args ) => {
		const URL = `https://www.reddit.com/r/${ args.subreddit || 'javascript' }.json`;
		return axios.get( URL )
			.then( (response) => {
				const __posts = [];
				const posts = response.data.data.children;

				posts.map( post => {
					post.data.content = post.data.selftext_html;
					__posts.push( post.data );
				} );
				return __posts;
			})
			.catch( (error) => {
				return { error: error }
			});

	}
	


}

module.exports = PostsController;
