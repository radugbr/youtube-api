import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"

import {
  GetListByKeyword,
  GetChannelById,
  GetVideoDetails,
  getAutoCompleteSearch,
  getMoreComments,
  getMoreSuggestions,
  GetPlaylistData,
  getFeed,
  GetHomeFeed
} from "./api/parser.js"

// Load .env file
dotenv.config();

// Get Port from .env file
const port = process.env.PORT || 3000;
const host_name = process.env.HOST_NAME || 'localhost'

// Cors settings
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
  port: port,
};

// Error handler for any errors
const errorHandler = (error, req, res, next) => {
  // Logging the error here
  console.log(error);
  // Returning the status and error message to client
  return res.status(400).json({
    error: true,
    message: error.message,
  });
}


// Initialize Express
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(errorHandler);

/**
 * Get Home page videos
 */
app.get('/', async function (req, res, next) {
  try {
    const recentUpdates = await GetHomeFeed();
    res.status(200).json(recentUpdates);
  } catch (error) {
    next(error)
  }
});

/**
 * AutoComplete Search
 */
app.get('/autocomplete', async function (req, res, next) {
  try {

    const keyword = req.query.q;

    const recentUpdates = await getAutoCompleteSearch(keyword);
    res.status(200).json(recentUpdates);
  } catch (error) {
    next(error)
  }
});

/**
 * Get Search results
 */
app.get('/search', async function (req, res, next) {

  try {

    const keyword = req.query.keyword;

    const searchResults = await GetListByKeyword(keyword, false, 30, [{ type: 'video', sortBy: 'upload_date' }]);

    res.status(200).json(searchResults);

  } catch (error) {
    next(error)
  }

});

/**
 * Get Video details with suggestions
 */
app.get('/watch/:id', async function (req, res, next) {
  const videoId = req.params.id;

  try {
    const video = await GetVideoDetails(videoId);

    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
});

/**
 * Get Video More Comments
 */
app.post('/watch/:id/comments', async function (req, res, next) {

  try {
    const data = req.body.context;
    const comments = await getMoreComments(data);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});


/**
 * Get Video more suggestions
 */
app.post('/watch/:id/suggestions', async function (req, res, next) {

  try {
    const data = req.body.context;
    const suggestions = await getMoreSuggestions(data);
    res.status(200).json(suggestions);
  } catch (error) {
    next(error);
  }
});

/**
 * Get Channel details 
 */
app.get('/channel/:id', async function (req, res, next) {

  try {
    const channelId = req.params.id;

    const channel = await GetChannelById(channelId);

    res.status(200).json(channel);
  } catch (error) {
    next(error);
  }

});

/**
 * Get Channel details 
 */
app.get('/playlist/:id', async function (req, res, next) {

  try {
    const playlistId = req.params.id;

    const playlist = await GetPlaylistData(playlistId);

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }

});

/**
 * Menus
 */
app.get('/:name', async function (req, res, next) {

  try {
    const name = req.params.name;

    const contents = await getFeed(name);

    res.status(200).json(contents);

  } catch (error) {
    next(error);
  }
});


// Express server config
app.listen(port, host_name, () => {
  console.log('Express server is listening on port %d in %s mode', port, app.settings.env);
});