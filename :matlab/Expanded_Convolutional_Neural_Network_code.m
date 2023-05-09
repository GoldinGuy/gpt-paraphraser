%% LING 227 Final Project - Convolutional Neural Network Text Classification
% Special thanks to Mathworks for sample code and various organizations for 
% sample essays

% This code will analyze the organic and artificial literature and create a
% convolutional neural network that will attempt to perform text
% classification. 

% This is the expanded version that includes a training set from the
% paraphrased ChatGPT essays

% Functions provided by The MathWorks, Inc. (www.mathworks.com.)
%% Clear workspace and load data

clc;
clear;
close all;

% Read in first file
S = fileread('chatgpt_essay.txt');
chatgpt_essay = regexp(S, '\.', 'split');
% Transpose for vertical column
chatgpt_essay = chatgpt_essay.';

% Read in second file
S = fileread('organic_essay.txt');
organic_essay = regexp(S, '\.', 'split');
%Transpose for vertical column
organic_essay = organic_essay.';

% Read in third file
S = fileread('paraphrased_data.txt');
paraphrased_essay = regexp(S, '\.', 'split');
%Transpose for vertical column
paraphrased_essay = paraphrased_essay.';
%% Create tables and Format Data;

chatgpt_table = array2table(chatgpt_essay);
chatgpt_table.Properties.VariableNames(1) = "sentances";

organic_table = array2table(organic_essay);
organic_table.Properties.VariableNames(1) = "sentances";

paraphrased_table = array2table(paraphrased_essay);
paraphrased_table.Properties.VariableNames(1) = "sentances";

% Create "tagging" array(s)
tagging = "ChatGPT";
tagging_arr = repelem(tagging,length(chatgpt_essay));
tagging_arr = tagging_arr.';

tagging2 = "Organic";
tagging_arr2 = repelem(tagging2,length(organic_essay));
tagging_arr2 = tagging_arr2.';

tagging3 = "Paraphrased";
tagging_arr3 = repelem(tagging3,length(paraphrased_essay));
tagging_arr3 = tagging_arr3.';

% Turn tagging array to table
tagging_table = array2table(tagging_arr);
tagging2_table = array2table(tagging_arr2);
tagging3_table = array2table(tagging_arr3);

% Combine tagging with data
chatgpt_tagged = [chatgpt_table tagging_table];
chatgpt_tagged.Properties.VariableNames(2) = "tag";

organic_tagged = [organic_table tagging2_table];
organic_tagged.Properties.VariableNames(2) = "tag";

paraphrased_tagged = [paraphrased_table tagging3_table];
paraphrased_tagged.Properties.VariableNames(2) = "tag";

essay_data = vertcat(chatgpt_tagged, organic_tagged);

% To reflect comments made during presentation, the below table will
% be utilized
neo_essay_data = vertcat(essay_data, paraphrased_tagged);

% Shuffle
neo_shuffled_data = neo_essay_data(randperm(size(neo_essay_data,1)),:);

% To avoid MATLAB errors regarding str/char arrays, consider
% write(neo_shuffled_data, "neo_shuffled_data.csv") 
% which treats the table with standardized character/string types
%% Begin splitting data

data = readtable("neo_shuffled_data.csv");

% Split data into validation and non-validation
cross_validation = cvpartition(data.tag,Holdout=0.2); % Save 30% of data
data_to_train = data(training(cross_validation),:);
data_to_validate = data(test(cross_validation),:);

% Get text ready for classification through "preprocessText" function
processed_docs = preprocessText(data_to_train.sentances);
training_data = categorical(data_to_train.tag);

% Extract necessary characteristcis from the data
tags = unique(training_data);
number_of_observations = numel(training_data);
documentsValidation = preprocessText(data_to_validate.sentances);
validation = categorical(data_to_validate.tag);


%% Encodings and Word Sequencing
% Call functions to derive word embeddingd and create arrays
encodings = wordEncoding(processed_docs);
numWords = encodings.NumWords;
x_train = doc2sequence(encodings,processed_docs);
x_validation = doc2sequence(encodings,documentsValidation);
%% Set Parameters

% Hyperparameters (we can mess around with, but below are optimal)
dimensions_of_embeddings = 100;
ngramLengths = [2 3 4 5];
number_of_filters = 200;

% Network Parameters
minLength = 1; % min(doclength(processed_docs))
layers = [ 
    sequenceInputLayer(1,MinLength=minLength)
    wordEmbeddingLayer(dimensions_of_embeddings,numWords,Name="emb")];
lgraph = layerGraph(layers);


% Specify n-gram and create layers for Network Architecture
num_n_grams = numel(ngramLengths);
for j = 1:num_n_grams
    N = ngramLengths(j);
    block = [
        convolution1dLayer(N,number_of_filters,Name="conv"+N,Padding="same")
        batchNormalizationLayer(Name="bn"+N)
        reluLayer(Name="relu"+N)
        dropoutLayer(0.2,Name="drop"+N)
        globalMaxPooling1dLayer(Name="max"+N)];
    
    lgraph = addLayers(lgraph,block);
    lgraph = connectLayers(lgraph,"emb","conv"+N);
end

number_of_tags = numel(tags);

% Identify layers
layers = [
    concatenationLayer(1,num_n_grams,Name="cat")
    fullyConnectedLayer(number_of_tags,Name="fc")
    softmaxLayer(Name="soft")
    classificationLayer(Name="tag")];

lgraph = addLayers(lgraph,layers);

% Label connections between n-grams
for j = 1:num_n_grams
    N = ngramLengths(j);
    lgraph = connectLayers(lgraph,"max"+N,"cat/in"+j);
end

% Plot network architecture
figure
plot(lgraph)
title("Network Architecture")
%% Train Neural Network
% Set options for the appropriate graphs
options = trainingOptions("adam", ...
    MiniBatchSize=128, ...
    ValidationData={x_validation,validation}, ...
    OutputNetwork="best-validation-loss", ...
    Plots="training-progress", ...
    Verbose=false);

% Run through training process 
neural_network = trainNetwork(x_train,training_data,lgraph,options);
%% Test Neural Network

% Run through cross validation and produce graphs
y_validation = classify(neural_network,x_validation);
figure
confusionchart(validation,y_validation)
accuracy = mean(validation == y_validation)

%% Bonus! Prediction using new data

% Manually insert the sentances to be defined 
% The first sentance was derived from an essay by the ChatGPT command 
% "Please write an essay" while the second is derived
% produced by the paraphrased version of that ChatGPT essay

% For better accuracy, inputting a full essay will provide even better
% accuracy
new_sentances = [ 
    "Dеsріtе tһе cоmрӏехіtу оf tһе tоріcs wе dеbatеd, wе fоund јоу іn оur wоrk, fоrgіng dеер frіеndsһірs aӏоng tһе waу." 
    "It was a sреcіaӏ tіmе tһat I wіӏӏ nеvеr fоrgеt."];

% Run through network and reveal classification
new_data = preprocessText(new_sentances);
new_x = doc2sequence(encodings,new_data);
new_y = classify(neural_network,new_x)

%% Functions (via MATLAB & Mathworks)

function documents = preprocessText(textData)

documents = tokenizedDocument(textData);
documents = lower(documents);

end

%% 
% _Copyright 2020 The MathWorks, Inc._ for functions and templates on how
% to perform convolutional neural network text classification