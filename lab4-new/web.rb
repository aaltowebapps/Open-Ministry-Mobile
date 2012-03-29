require 'sinatra'
require 'json'
require 'manifesto'

$tasks = [
  {title: "Order pizza", seconds: 320, timestamp: 0},
  {title: "Eat all the pizza", seconds: 1339, timestamp: 0},
]

set :static, true
set :public_folder, File.join(File.dirname(__FILE__), 'public')

get '/' do
  "Hello, world"
end

get '/tasks' do
  content_type :json
#  {tasks: $tasks}.to_json
  $tasks.to_json
end

post '/tasks' do
  p params
  content_type :json
  {}.to_json
end

get '/manifest' do
  headers 'Content-Type' => 'text/cache-manifest' # Must be served with this MIME type
  Manifesto.cache
end
