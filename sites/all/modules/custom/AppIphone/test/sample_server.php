<?php
/**
 * @file
 * sample_server.php
 *
 * Push server demo
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://code.google.com/p/apns-php/wiki/License
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to aldo.armiento@gmail.com so we can send you a copy immediately.
 *
 * @author (C) 2010 Aldo Armiento (aldo.armiento@gmail.com)
 * @version $Id$
 */

// Adjust to your timezone
date_default_timezone_set('Europe/Rome');

// Report all PHP errors
error_reporting(-1);

// Using Autoload all classes are loaded on-demand
require_once 'ApnsPHP/Autoload.php';

// Instanciate a new ApnsPHP_Push object
$server = new ApnsPHP_Push_Server(
	ApnsPHP_Abstract::ENVIRONMENT_SANDBOX,
   'GiaVang_Dev.pem'
);

// Set the Root Certificate Autority to verify the Apple remote peer
$server->setRootCertificationAuthority('GiaVang_Dev.pem');

// Set the number of concurrent processes
$server->setProcesses(2);

// Starts the server forking the new processes
$server->start();

// Main loop...
$i = 1;
while ($server->run()) {

	// Check the error queue
	$aErrorQueue = $server->getErrors();
	if (!empty($aErrorQueue)) {
		// Do somethings with this error messages...
		var_dump($aErrorQueue);
	}

	// Send 10 messages
	if ($i <= 10) {
		// Instantiate a new Message with a single recipient
		$message = new ApnsPHP_Message('df5795d3960fe769d695fabdaffed83216c86aca822cb5aea8500f7226f8e945');

		// Set badge icon to "i"
		$message->setBadge($i);
        $message->setText('Hello APNs-enabled device!');

		// Add the message to the message queue
		$server->add($message);

		$i++;
	}

	// Sleep a little...
	usleep(200000);
}
